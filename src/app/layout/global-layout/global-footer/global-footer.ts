import { Component, inject } from '@angular/core';
import { SessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'app-global-footer',
  standalone: true,
  templateUrl: './global-footer.html'
})
export class GlobalFooterComponent {
  private sessionService = inject(SessionService);
  
  systemInfo = this.sessionService.system;
  
  readonly currentYear = new Date().getFullYear();
}