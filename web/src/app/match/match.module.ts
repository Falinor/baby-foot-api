import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LatestMatchesComponent } from './latest-matches';
import { MatchService } from './shared';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LatestMatchesComponent
  ],
  exports: [
    LatestMatchesComponent
  ],
  providers: [
    MatchService
  ]
})
export class MatchModule { }
