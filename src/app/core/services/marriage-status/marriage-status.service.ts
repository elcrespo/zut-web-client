import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarriageStatus } from '../../models/marriage-status.model';

@Injectable({
  providedIn: 'root'
})
export class MarriageStatusService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<MarriageStatus[]>('marriage-status');
  }
}
