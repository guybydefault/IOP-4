import {Component, OnInit} from '@angular/core';
import {AuthService} from '../app-login-form/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {AppCheckPlotComponent} from '../app-check-plot/app-check-plot.component';

@Component({
  selector: 'app-app-check',
  templateUrl: './app-check.component.html',
  styleUrls: ['./app-check.component.css']
})
export class AppCheckComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {
  }


  ngOnInit() {

  }

}
