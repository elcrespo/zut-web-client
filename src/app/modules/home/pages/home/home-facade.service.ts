import { Injectable } from '@angular/core';

import { RulingService } from 'src/app/core/services/ruling/ruling.service';
import { BehaviorSubject, from, combineLatest, of, Observable } from 'rxjs';
import { map, distinctUntilChanged, switchMap, flatMap, reduce, tap, catchError } from 'rxjs/operators';
import { VoteService } from 'src/app/core/services/vote/vote.service';
import { User } from 'src/app/core/models/user.model';
import { Ruling } from 'src/app/core/models/ruling.model';
import { AuthService } from 'src/app/core/auth.service';
import { Vote } from 'src/app/core/models/vote.model';
import {cloneDeep} from 'lodash';

export interface HomeState {
  user: User;
  rulings: Ruling[],
  loading: boolean
}
let _state: HomeState = {
  user: {
    username: '',
    _id: '',
    marrieageStatus: '',
    birthdate: ''
  },
  rulings: [],
  loading: true
};

@Injectable({
  providedIn: 'root'
})
export class HomeFacadeService {
  private store  = new BehaviorSubject<HomeState>(_state);
  private state$ = this.store.asObservable();

  user$ = this.state$.pipe(map(state => state.user), distinctUntilChanged());
  rulings$ = this.state$.pipe(map(state => state.rulings), distinctUntilChanged());
  loading$ = this.state$.pipe(map(state => state.loading));
  
  vm$:Observable<HomeState> = combineLatest(
    this.user$,
    this.rulings$,
    this.loading$ 
  ).pipe(
    map(([user, rulings, loading]) => ({user, rulings, loading}))
  )

  constructor(
    private rulingService: RulingService,
    private authService: AuthService,
    private voteService: VoteService
    ) {
      this.initializeObservables();
  }

  private initializeObservables() {
    this.rulingService.getAll()
    .pipe(
      switchMap(rulings => from(rulings)),
      flatMap(ruling => this.addTotalVotesToRuling(ruling)),
      flatMap(ruling => this.addVotesFromCurrenUserToRuling(ruling)),
      map(ruling => [ruling]),
      reduce((acc, current) => {
        return [...acc, ...current];
      } , []),
      catchError(error => of([])),
      tap(rulings => this.updateState({..._state, rulings, loading: false}))
    )
    .subscribe();
    
    this.authService.currentUser$.pipe(
      tap(user => this.updateUser(user))
    ).subscribe();
  }

  private addVotesFromCurrenUserToRuling(ruling: Ruling): Observable<any> {
    if(!this.authService.isLoggedIn) {
      return of(ruling)
    }
    return this.voteService
               .getVotesFromUserAndRuling(this.authService.currentUserValue._id, ruling._id)
               .pipe(
                 map((currentUserVotes) => ({...ruling, currentUserVotes}))
                );
  }

  private addTotalVotesToRuling(ruling: Ruling): Observable<Ruling> {
    return this.voteService.getVotesFromRuling(ruling._id).pipe(
      map((votes) => {
        return {...ruling, votes: [...votes]}
      })
    )
  }

  /** Update internal state cache and emit from store... */
  private updateState(state: HomeState) {
    this.store.next(_state = state); 
  }

  private updateUser(user) {
    if(user === null) {
      this.updateState({..._state, user: null})
      return;
    }
    this.updateState({..._state, user: {...user}})
  }

  private addVoteToVotes(votes = [], vote: Vote) {
    votes = cloneDeep(votes);
    if(votes.length === 0) {
      votes.push({_id: vote.vote, count: 1});
    } else {
      const indexVote = votes.findIndex(userVote => userVote._id === vote.vote);
      if(indexVote > -1) {
        votes[indexVote].count = votes[indexVote].count + 1;  
      } else {
        votes.push({_id: vote.vote, count:1});
      }
    }

    return votes;
  }

  private addVote(vote: Vote) {
    const rulings = cloneDeep(_state).rulings;

    const rulingToAddVoteIndex = rulings.findIndex(ruling => ruling._id === vote.ruling);
    const rulingToAddVote = rulings[rulingToAddVoteIndex];

    const totalVotes = this.addVoteToVotes(rulingToAddVote.votes, vote);
    const currentUserVotes = this.addVoteToVotes(rulingToAddVote.currentUserVotes, vote);

    rulingToAddVote.currentUserVotes = currentUserVotes;
    rulingToAddVote.votes = totalVotes;

    rulings[rulingToAddVoteIndex] = rulingToAddVote;

    this.updateState({..._state, rulings});
  }

  vote(ruling: Ruling, vote: number) {
    this.voteService.vote(
      this.authService.currentUserValue._id,
      ruling._id,
      vote
    ).pipe(
      tap(vote => this.addVote(vote))
    ).subscribe();
  }


}
