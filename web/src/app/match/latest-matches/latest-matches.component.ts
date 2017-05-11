import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Match, MatchService } from '../shared';

@Component({
  selector: 'octo-latest-matches',
  templateUrl: './latest-matches.component.html',
  styleUrls: ['./latest-matches.component.scss']
})
export class LatestMatchesComponent implements OnInit, OnDestroy {
  error: Error;
  matches: Match[];
  @Output() matchChange: EventEmitter<Match>;

  private subs: Subscription[];

  constructor(private matchService: MatchService) {
    this.subs = [];
    this.matchChange = new EventEmitter();
  }

  ngOnInit(): void {
    const sub = this.matchService.findLatestMatches()
      .subscribe(
        matches => this.matches = matches,
        error => this.error = error
      );
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  selectMatch(match: Match): void {
    this.matchChange.emit(match);
  }
}
