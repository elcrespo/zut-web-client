import { Component, OnInit } from '@angular/core';
import { HomeFacadeService, HomeState } from './home-facade.service';
import { Observable } from 'rxjs';
import { Ruling } from 'src/app/core/models/ruling.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  rulings$ = this.homeFacadeService.rulings$;
  vm$:Observable<HomeState> = this.homeFacadeService.vm$;

  constructor(private homeFacadeService: HomeFacadeService) { }

  ngOnInit() {
  }

  onVote(ruling: Ruling, vote: number) {
    this.homeFacadeService.vote(ruling, vote);
  }

}
