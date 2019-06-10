import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { schema, normalize } from 'normalizr';
import { HttpClient } from '@angular/common/http';
import { Ruling } from '../../models/ruling.model';

export interface NormalizedRuling {
  [key: number]: Ruling;
}

export interface NormalizedRulings {
  entities: {rulings: NormalizedRuling};
}

@Injectable({
  providedIn: 'root'
})
export class RulingService {

  constructor(private http: HttpClient) { }

  normalizeRuling(rulings:Ruling[]): NormalizedRulings {
    const rulingSchema = new schema.Entity('rulings');
    const rulingListSchema = new schema.Array(rulingSchema);
    return normalize(rulings, rulingListSchema);
  }

  getAll(): Observable<Ruling[]> {
    return this.http.get<Ruling[]>('ruling');
  }
}
