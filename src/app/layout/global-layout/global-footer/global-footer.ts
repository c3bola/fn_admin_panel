import { Component } from '@angular/core';

@Component({
  selector: 'app-global-footer',
  standalone: true,
  templateUrl: './global-footer.html'
})
export class GlobalFooterComponent {
  // Altere o ano ou o nome da marca aqui e mudará em toda a aplicação
  readonly currentYear = new Date().getFullYear();
  readonly companyName = 'Fortnite Brasil';
}