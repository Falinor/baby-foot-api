import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Match } from './match';

const API = '/api';

@Injectable()
export class MatchService {

  constructor(private http: Http) {}

  findLatestMatches(count: number = 10): Observable<Match[]> {
    if (count < 0) {
      throw new Error('Cannot retrieve a negative number of matches.');
    }
    return this.http.get(`${API}/matches?limit=${count}&order=updatedAt`)
      .map(this.json)
      .catch(this.error);
  }

  private json(res: Response): Match {
    if (!res.ok) {
      throw new Error(`${res.status} - ${res.statusText}`);
    }
    return res.json();
  }

  private error(err: Error | any, caught: Observable<Match>): Observable<any> {
    // TODO
    return null;
  }

}
