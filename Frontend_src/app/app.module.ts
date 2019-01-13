import {BrowserModule} from '@angular/platform-browser';
import {Injectable, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CheckHistoryComponent} from './check-history/check-history.component';
import {CheckService} from './check-history/check.service';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AppCheckHistoryAddComponent} from './app-check-history-add/app-check-history-add.component';
import {AppCheckPlotComponent} from './app-check-plot/app-check-plot.component';
import {AccordionModule, ButtonModule, PanelModule, RadioButtonModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppLoginFormComponent} from './app-login-form/app-login-form.component';
import {RouterModule, Routes} from '@angular/router';
import {AppCheckComponent} from './app-check/app-check.component';
import {AuthService} from './app-login-form/auth.service';
import {ReversePipe} from './check-history/reverse-pipe';

const appRoutes: Routes = [
  {
    path: 'check', component: AppCheckComponent,
    runGuardsAndResolvers: 'always'
  },
  {path: '**', component: AppLoginFormComponent},

];

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
    return next.handle(xhr);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    AppCheckComponent,
    CheckHistoryComponent,
    AppCheckHistoryAddComponent,
    AppCheckPlotComponent,
    AppLoginFormComponent,
    ReversePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AccordionModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})
  ],
  providers: [
    CheckService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true}
    ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

