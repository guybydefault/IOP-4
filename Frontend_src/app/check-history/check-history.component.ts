import {AfterContentInit, AfterViewChecked, Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CheckService} from './check.service';
import {Check} from './check.model';
import {AuthService} from '../app-login-form/auth.service';
import {AppComponent} from '../app.component';
import {ReversePipe} from './reverse-pipe';
import {NavigationEnd, Router} from '@angular/router';
import {AppCheckPlotComponent} from '../app-check-plot/app-check-plot.component';

@Component({
  selector: 'app-check-history',
  templateUrl: './check-history.component.html',
  styleUrls: ['./check-history.component.css'],
  providers: [ReversePipe]
})
export class CheckHistoryComponent implements OnInit {

  checks: Check[];

  constructor(private reverse: ReversePipe, private router: Router, private main: AppComponent,
              private checkService: CheckService, private authService: AuthService) {
  }

  @Output() checkReloadEvent = new EventEmitter();

  error: string;

  loadChecksAndRefresh() {
    this.checkService.getChecks().subscribe(data => {
      this.error = null;
      this.checks = data;
      this.checkReloadEvent.emit(this.checks);
    }, error => {
      this.checks = [];
      this.checkReloadEvent.emit(this.checks);
      this.error = 'При попытке загрузки результатов возникла ошибка: ' + error.statusText;
    });
  }

  ngOnInit() {
    this.loadChecksAndRefresh();
  }


}

