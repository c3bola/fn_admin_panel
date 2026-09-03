import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSidebarComponent } from './global-sidebar/global-sidebar';
import { GlobalTopbarComponent } from './global-topbar/global-topbar';
import { GlobalFooterComponent } from './global-footer/global-footer';

@Component({
  selector: 'app-global-layout',
  standalone: true,
  imports: [RouterOutlet, GlobalSidebarComponent, GlobalTopbarComponent, GlobalFooterComponent],
  templateUrl: './global-layout.html'
})
export class GlobalLayoutComponent {}