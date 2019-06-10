import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ruling } from 'src/app/core/models/ruling.model';
import { Subject, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { withLatestFrom, filter, map, tap, shareReplay } from 'rxjs/operators';


@Component({
  selector: 'app-ruling',
  templateUrl: './ruling.component.html',
  styleUrls: ['./ruling.component.scss']
})
export class RulingComponent implements OnInit {
  @Input() set ruling (value: Ruling) {
    this.rulingSubject.next(value);
  }
  @Input() set isUserLogged (value: boolean) {
    this.isUserLoggedSubject.next(value);
  };
  @Input() set maxVotesPerUser (value: number) {
    this.maxVotesPerUserSubject.next(value);
  }

  @Output() onVote: EventEmitter<any> = new EventEmitter();

  private voteSelectedSubject: Subject<'1' | '-1'> = new Subject();
  private voteSubject: Subject<void> = new Subject();
  private isUserLoggedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private maxVotesPerUserSubject: BehaviorSubject<number> = new BehaviorSubject(8);
  private rulingSubject: BehaviorSubject<Ruling> = new BehaviorSubject(undefined);
  private voteAgainSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isUserLogged$: Observable<boolean> = this.isUserLoggedSubject.asObservable();
  voteSelected$: Observable<'1' | '-1'> = this.voteSelectedSubject.asObservable();
  vote$: Observable<void> = this.voteSubject.asObservable();
  maxVotesPerUser$ = this.maxVotesPerUserSubject.asObservable();
  ruling$ = this.rulingSubject.asObservable();
  canVote$: Observable<boolean>;
  userAlreadyVoted$: Observable<boolean>;
  alreadyVotedCanVoteAgain$: Observable<boolean>;
  voteAgain$: Observable<boolean> = this.voteAgainSubject.asObservable();
  totalVotes$: Observable<{down: string, up: string, total: number}>;
  

  constructor() { }

  ngOnInit() {
    const currentUserVotes$ = this.ruling$.pipe(
      map(ruling => ruling.currentUserVotes || []),
      map(currentUserVotes => currentUserVotes.reduce((accumulator, currentValue) => { return accumulator + currentValue.count}, 0 ))
    );

    this.totalVotes$ = this.ruling$.pipe(
      map(ruling => ruling.votes),
      map(votes => {
        const thumbsUp = votes.find(vote => vote._id === "1");
        const thumbsDown = votes.find(vote => vote._id === "-1");
        const thumbsUpTotal = thumbsUp ? thumbsUp.count : 0;
        const thumbsDownTotal = thumbsDown ? thumbsDown.count : 0;
        const total = thumbsDownTotal + thumbsUpTotal;

        if(total <= 0) {
          return {
            down: '0',
            up: '0',
            total: 0
          }
        }
        return {
          down: ((thumbsDownTotal*100)/total).toString(),
          up:  ((thumbsUpTotal*100)/total).toString(),
          total
        }
      })
    )

    this.userAlreadyVoted$ = currentUserVotes$.pipe(
      map(votes => votes > 0)
      );

    const state$ = combineLatest(
      currentUserVotes$,
      this.isUserLogged$,
      this.maxVotesPerUser$
    );

    this.canVote$ = state$.pipe(
      map(([currentUserVotes, userlogged, maxVotes]) => currentUserVotes < maxVotes && userlogged)
    );

    this.alreadyVotedCanVoteAgain$ = combineLatest(
      this.userAlreadyVoted$,
      this.canVote$
    ).pipe(
      map(([alreadyVote, canVote]) => !!alreadyVote && !!canVote)
    );

    this.vote$.pipe(
      withLatestFrom(this.voteSelected$),
      withLatestFrom(this.canVote$),
      filter(([voteArray, canVote]) => canVote),
      tap(([voteArray]) =>{
        const [_, vote] = voteArray;
        this.voteAgainSubject.next(false);
        this.onVote.emit(vote.toString());
      })
    ).subscribe();
  }

  onSelectVote(vote: '1' | '-1') {
    this.voteSelectedSubject.next(vote);
  }

  onVoteClick() {
    this.voteSubject.next();
  }

  onVoteAgain() {
    this.voteAgainSubject.next(true)
  }

}
