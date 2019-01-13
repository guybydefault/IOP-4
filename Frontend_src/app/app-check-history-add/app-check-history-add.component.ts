import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AppComponent} from '../app.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckService} from '../check-history/check.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';


@Component({
  providers: [AppComponent],
  selector: 'app-check-history-add',
  templateUrl: './app-check-history-add.component.html',
  styleUrls: ['./app-check-history-add.component.css']
})
export class AppCheckHistoryAddComponent implements OnInit {
  rValues = [1, 2, 3, 4, 5];
  xValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
  x = '0';
  y = '0';
  r = '1';
  MAX_Y_LENGTH = 15;
  errors = [];

  constructor(private router: Router, private main: AppComponent, private checkService: CheckService) {

  }

  @Output() radiusChangedEvent = new EventEmitter();
  @Output() checkAddedEvent = new EventEmitter();

  ngOnInit() {
  }


  validateInput() {
    this.errors = [];
    const y = Number(this.y);
    const x = Number(this.x);
    const r = Number(this.r);

    if (this.y.trim() === '') {
      this.errors.push('Значение Y не задано');
    } else if (isNaN(y)) {
      this.errors.push('Y не представляет собой корректное число');
    } else if (this.y.length > this.MAX_Y_LENGTH) {
      this.errors.push('Извините, число Y слишком длинное, чтобы мы могли обработать его ввод');
    } else if (!(y < 3 && y > -5)) {
      this.errors.push('Y не входит в рамки рассматриваемого диапазона');
    }

    if (!(x >= -3 && x <= 5)) {
      this.errors.push('X не входит в рамки рассматриваемого диапазона');
    }

    return this.errors.length === 0;
  }

  check() {
    if (!this.validateInput()) {
      return;
    }
    this.checkService.addCheck(this.x, this.y, this.r).subscribe(null, (error => {
      this.errors = ['Ошибка сервера: ' + error.statusText];
    }), () => {
      this.checkAddedEvent.emit();
    });
  }

  onChartClick(coordinates) {
    this.x = coordinates.x;
    this.y = coordinates.y;
    this.check();
  }

  updateRadiusValue(e) {
    this.radiusChangedEvent.emit(this.r);
  }

}
