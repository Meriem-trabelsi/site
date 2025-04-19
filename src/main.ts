import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  platformBrowserDynamic()
  .bootstrapModule(AppComponent, { ngZone: 'noop', providers: [{ provide: FormsModule }] })
  .catch(err => console.error(err));

  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(HttpClientModule)
    ]
  });
