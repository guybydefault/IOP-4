import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class AuthService {

  private apiUrl = '/api/';

  credentials: { username: '', password: '' };
  authenticated = false;

  constructor(private http: HttpClient, private router: Router) {
    try {
      this.credentials = JSON.parse(localStorage.getItem('credentials'));
      this.authenticated = this.credentials.username ? true : false;
    } catch (exc) {
      console.log(exc);
    }
  }


  clearAuthentication() {
    this.authenticated = false;
    localStorage.setItem('credentials', null);
    this.router.navigateByUrl('/login');
  }

  getCurrentHttpAuthorizationHeaders() {
    return this.generateHttpAuthorizationHeaders(this.credentials);
  }

  generateHttpAuthorizationHeaders(credentials) {
    return new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});
  }


  register(credentials, callback) {
    this.http.post(this.apiUrl + 'register', null, {
      params: {
        username: credentials.username,
        password: credentials.password
      }
    }).subscribe(response => {
      if (response !== null) {
        callback(response['error']);
      } else {
        this.authenticated = true;
        this.credentials = credentials;
        localStorage.setItem('credentials', JSON.stringify(credentials));
        return callback && callback();
      }
    }, err => {
      callback(err.statusText);
    });
  }

  authenticate(credentials, callback) {
    this.http.get(this.apiUrl + 'user', {headers: this.generateHttpAuthorizationHeaders(credentials)}).subscribe(response => {
      if (response['name']) {
        this.authenticated = true;
        this.credentials = credentials;
        localStorage.setItem('credentials', JSON.stringify(credentials));
      } else {
        this.authenticated = false;
        localStorage.setItem('credentials', null);
      }
      return callback && callback();
    }, err => {
      callback(err);
    });
  }

  public logout() {
    this.http.post(this.apiUrl + 'logout', {}, {headers: this.generateHttpAuthorizationHeaders(this.credentials)}).subscribe();
    this.authenticated = false;
    localStorage.setItem('credentials', null);
  }
}
