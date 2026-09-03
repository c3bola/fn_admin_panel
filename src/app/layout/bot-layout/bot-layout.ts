import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BotSidebarComponent } from './bot-sidebar/bot-sidebar';
import { GlobalTopbarComponent } from '../global-layout/global-topbar/global-topbar';
import { GlobalFooterComponent } from '../global-layout/global-footer/global-footer';

@Component({
  selector: 'app-bot-layout',
  standalone: true,
  imports: [RouterOutlet, BotSidebarComponent, GlobalTopbarComponent, GlobalFooterComponent],
  templateUrl: './bot-layout.html'
})
export class BotLayoutComponent {}