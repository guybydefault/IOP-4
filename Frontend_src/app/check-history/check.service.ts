import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Check} from './check.model';
import {AuthService} from '../app-login-form/auth.service';
import {Observable} from 'rxjs';
import {share} from 'rxjs/operators';


@Injectable()
export class CheckService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  private apiUrl = '/api/';

  private void;

  onError(error) {
    if (error.status === 401) {
      this.authService.clearAuthentication();
    }
  }

  public getChecks() {
    const res = this.http.get<Check[]>(this.apiUrl + 'history', {headers: this.authService.getCurrentHttpAuthorizationHeaders()})
      .pipe(share());
    res.subscribe(null, error => {
      this.onError(error);
    });
    return res;
  }

  public addCheck(x, y, r) {
    const res = this.http.post<Check>(this.apiUrl + 'check', JSON.stringify({x: x, y: y, r: r}),
      {
        headers: this.authService.getCurrentHttpAuthorizationHeaders().append('Content-Type', 'application/json')
      }).pipe(share());
    res.subscribe(null, error => {
      this.onError(error);
    });
    return res;
  }
}
