import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSidebarComponent } from './global-sidebar/global-sidebar';
import { GlobalTopbarComponent } from './global-topbar/global-topbar';
import { GlobalFooterComponent } from './global-footer/global-footer';
import { SessionService } from '../../core/auth/session.service';

@Component({
  selector: 'app-global-layout',
  standalone: true,
  imports: [
    RouterOutlet, 
    GlobalSidebarComponent, 
    GlobalTopbarComponent, 
    GlobalFooterComponent 
  ],
  templateUrl: './global-layout.html',
})
export class GlobalLayoutComponent implements OnInit {
  private sessionService = inject(SessionService);

  ngOnInit() {
    this.sessionService.loadSessionContext().subscribe({
      error: (err) => console.error('Erro ao carregar sessão', err)
    });
  }
}