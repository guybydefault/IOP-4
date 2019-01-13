import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppComponent} from '../app.component';

declare var $: any;

@Component({
  providers: [AppComponent],
  selector: 'app-app-check-plot',
  templateUrl: './app-check-plot.component.html',
  styleUrls: ['./app-check-plot.component.css'],

})
export class AppCheckPlotComponent implements OnInit {

  constructor(private main: AppComponent) {
  }

  PLOT_COLOR = '#167ffb';
  AXIS_COLOR = 'black';
  AXIS_SIZE = 6;
  ARROWS_K = 2; // k - tgALPHA where ALPHA is the angle of the line which forms an arrow
  TEXT_COLOR = 'lightgray';
  RESTRICTION_LINE_COLOR = 'red';
  PLOT_LINE_WIDTH = 3;
  DIGITS_AFTER_DOT = 2;
  _size = 0;
  _chart: any;
  _radius = 0;

  @Output()
  chartCheckEvent = new EventEmitter();

  reload(data, r) {
    this._radius = Number(r);
    this.drawChart();
    this.loadChartData(data);
  }

  ngOnInit(): void {
    this._chart = $('#chart');
    this._size = Number(this._chart.attr('width').replace('px', ''));
    this._chart.click(e => {
      this.chartClick(e);
    });
  }

  xVirtual(coord) {
    return this._size / 2 + this.toVirtualScale(coord);
  }

  yVirtual(coord) {
    return this._size / 2 - this.toVirtualScale(coord);
  }

  xReal(coord) {
    return (coord - this._size / 2) / (this._size / 2 / this.AXIS_SIZE);
  }

  yReal(coord) {
    return (this._size / 2 - coord) / (this._size / 2 / this.AXIS_SIZE);
  }

  toVirtualScale(coord) {
    return coord * this._size / (this.AXIS_SIZE * 2);
  }

  drawChart() {
    this.drawBackground();
    this.drawAxis();
    this.drawArrows();
    this.drawAxisNames();
    this.drawAxisValues();
    this.drawRestrictions();
    this.drawFigure();
  }

  drawBackground() {
    this._chart.drawRect({
      fillStyle: 'white',
      x: 0, y: 0,
      fromCenter: false,
      width: this._size,
      height: this._size
    });
  }

  drawAxis() {
    this.drawGenericLine(-this.AXIS_SIZE, 0, this.AXIS_SIZE, 0, this.AXIS_COLOR);
    this.drawGenericLine(0, -this.AXIS_SIZE, 0, this.AXIS_SIZE, this.AXIS_COLOR);
  }

// Draws line from (x1; y1) with tgALPHA = k and given length (may be negative if you want to draw in reverse direction on x)
  drawLineByLength(x1, y1, k, length, strokeStyle) {
    const x2 = length / Math.sqrt(1 + k * k) + x1;
    const y2 = k * (x2 - x1) + y1;
    this.drawGenericLine(x1, y1, x2, y2, strokeStyle);
  }

  drawArrows() {
    this.drawLineByLength(0, this.AXIS_SIZE, -this.ARROWS_K, 0.5, this.AXIS_COLOR);
    this.drawLineByLength(0, this.AXIS_SIZE, this.ARROWS_K, -0.5, this.AXIS_COLOR);
    this.drawLineByLength(this.AXIS_SIZE, 0, 1 / this.ARROWS_K, -0.5, this.AXIS_COLOR);
    this.drawLineByLength(this.AXIS_SIZE, 0, -1 / this.ARROWS_K, -0.5, this.AXIS_COLOR);
  }

  drawAxisNames() {
    this.drawGenericText('y', 0.5, this.AXIS_SIZE - 0.5, 25);
    this.drawGenericText('x', this.AXIS_SIZE - 0.5, 0.5, 25);
  }

  drawAxisValues() {
    for (let i = -this.AXIS_SIZE + 1; i < this.AXIS_SIZE; i++) {
      if (i === 0) {
        continue;
      }

      this.drawGenericLine(-0.25, i, 0.25, i, this.AXIS_COLOR);
      this.drawGenericLine(i, -0.25, i, 0.25, this.AXIS_COLOR);

      this.drawGenericText(i, 0.5, i, 15);
      this.drawGenericText(i, i, 0.5, 15);
    }
  }

  drawRestrictions() {
    this.drawGenericLine(-3, -this.AXIS_SIZE, -3, this.AXIS_SIZE, this.RESTRICTION_LINE_COLOR, 1, [5]);
    this.drawGenericLine(5, -this.AXIS_SIZE, 5, this.AXIS_SIZE, this.RESTRICTION_LINE_COLOR, 1, [5]);
    this.drawGenericLine(-this.AXIS_SIZE, -5, this.AXIS_SIZE, -5, this.RESTRICTION_LINE_COLOR, 1, [5]);
    this.drawGenericLine(-this.AXIS_SIZE, 3, this.AXIS_SIZE, 3, this.RESTRICTION_LINE_COLOR, 1, [5]);
  }

  drawArc(xCenter, yCenter, r, startAngle, endAngle, strokeStyle, strokeWidth = 1) {
    this._chart.drawArc({
      strokeStyle: this.PLOT_COLOR,
      strokeWidth: strokeWidth,
      x: this.xVirtual(xCenter), y: this.yVirtual(yCenter),
      radius: this.toVirtualScale(r),
      start: startAngle, end: endAngle
    });
  }

  drawFigure() {
    this.drawGenericLine(0, this._radius, this._radius, 0, this.PLOT_COLOR, this.PLOT_LINE_WIDTH);
    this.drawGenericLine(this._radius / 2, 0, this._radius / 2, -this._radius, this.PLOT_COLOR, this.PLOT_LINE_WIDTH);
    this.drawGenericLine(this._radius / 2, 0, this._radius, 0, this.PLOT_COLOR, this.PLOT_LINE_WIDTH);
    this.drawGenericLine(0, -this._radius, this._radius / 2, -this._radius, this.PLOT_COLOR, this.PLOT_LINE_WIDTH);
    this.drawGenericLine(0, 0, 0, this._radius, this.PLOT_COLOR, this.PLOT_LINE_WIDTH);
    this.drawGenericLine(-this._radius, 0, 0, 0, this.PLOT_COLOR, this.PLOT_LINE_WIDTH);
    this.drawArc(0, 0, this._radius, 180, 270, this.PLOT_COLOR, this.PLOT_LINE_WIDTH);
  }

  drawGenericText(text, x, y, size) {
    this._chart.drawText({
      text: text,
      fontFamily: 'helvetica',
      fontSize: size,
      fillStyle: this.TEXT_COLOR,
      x: this.xVirtual(x), y: this.yVirtual(y)
    });
  }

  drawGenericLine(x1, y1, x2, y2, strokeStyle, strokeWidth = 1, strokeDash = []) {
    this._chart.drawLine({
      strokeStyle: strokeStyle,
      strokeWidth: strokeWidth,
      strokeDash: strokeDash,
      strokeDashOffset: 0,
      x1: this.xVirtual(x1), y1: this.yVirtual(y1),
      x2: this.xVirtual(x2), y2: this.yVirtual(y2),
    });
  }

  drawGenericPoint(draw_x, draw_y, fillStyle) {
    this._chart.drawEllipse({
      fillStyle: fillStyle,
      x: this.xVirtual(draw_x), y: this.yVirtual(draw_y),
      width: 4, height: 4
    });
  }

  loadChartData(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].r === this._radius) {
        this.drawGenericPoint(data[i].x, data[i].y, data[i].inArea ? '#28A745' : '#DC3545');
      }
    }
  }

  chartClick(e) {
    const x = e.pageX - this._chart.offset().left;
    const y = e.pageY - this._chart.offset().top;

    const chart_x = this.xReal(x).toFixed(this.DIGITS_AFTER_DOT);
    const chart_y = this.yReal(y).toFixed(this.DIGITS_AFTER_DOT);

    this.chartCheckEvent.emit({x: chart_x, y: chart_y});
  }


}
