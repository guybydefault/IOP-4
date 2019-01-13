import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-app-login-form',
  templateUrl: './app-login-form.component.html',
  styleUrls: ['./app-login-form.component.css']
})
export class AppLoginFormComponent implements OnInit {

  credentials = {username: '', password: ''};
  errorMsg: string;

  constructor(private router: Router, public authService: AuthService) {
  }

  ngOnInit() {
  }

  validateCredentials() {
    if (!this.credentials.username.trim() || !this.credentials.password.trim()) {
      this.errorMsg = 'Пожалуйста, введите логин и пароль';
      return false;
    }
    if (!(/^[a-zA-Z]+$/.test(this.credentials.username))) {
      this.errorMsg = 'Ник пользователя должен состоять только из латинских букв';
      return false;
    }
    return true;
  }

  login() {
    if (!this.validateCredentials()) {
      return;
    }
    this.authService.authenticate(this.credentials, (err) => {
      if (!this.authService.authenticated) {
        this.errorMsg = 'Неудачная попытка входа: ' + (err.status === 401 ? 'неверный логин или пароль' : err.statusText);
      }
    });
  }

  register() {
    if (!this.validateCredentials()) {
      return;
    }
    this.authService.register(this.credentials, (err) => {
      if (!this.authService.authenticated) {
        this.errorMsg = 'Ошибка регистрации: ' + err;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}
