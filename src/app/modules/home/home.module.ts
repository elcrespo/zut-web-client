import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MainRulingComponent } from './components/main-ruling/main-ruling.component';
import { RulingComponent } from './components/ruling/ruling.component';
import { SubmitNameComponent } from './components/submit-name/submit-name.component';
import {TimeAgoPipe} from 'time-ago-pipe';

@NgModule({
  declarations: [HomeComponent, MainRulingComponent, RulingComponent, SubmitNameComponent, TimeAgoPipe],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FlexLayoutModule
  ]
})
export class HomeModule { }
