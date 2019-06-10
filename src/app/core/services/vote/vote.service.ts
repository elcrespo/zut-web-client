import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GroupedVotes, Vote } from '../../models/vote.model';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private http: HttpClient) { }

  getVotesFromRuling(rulingId: String): Observable<GroupedVotes[]> {
    return this.http.get<GroupedVotes[]>(`vote/ruling/${rulingId}`)
  }

  getVotesFromUserAndRuling(userId: string, rulingId: string) {
    return this.http.get(`vote/user/${userId}/ruling/${rulingId}`);
  }
  
  vote(userId, rulingId, vote): Observable<Vote> {
    return this.http.post<Vote>('vote', {user: userId, ruling: rulingId, vote})
  }
}
