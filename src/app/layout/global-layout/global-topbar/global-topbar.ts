import { Component, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../shared/services/layout.service';
import { LucideAngularModule, Menu, Bot, Bell, ChevronDown, Check, LogOut, Settings, User, Search } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-global-topbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './global-topbar.html'
})
export class GlobalTopbarComponent {
  layoutService = inject(LayoutService);
  
  // Ícones Lucide
  readonly Menu = Menu;
  readonly Bot = Bot;
  readonly Bell = Bell;
  readonly ChevronDown = ChevronDown;
  readonly Check = Check;
  readonly LogOut = LogOut;
  readonly Settings = Settings;
  readonly User = User;

  // Estado dos menus dropdown
  isBotDropdownOpen = signal(false);
  isProfileDropdownOpen = signal(false);
  isNotificationsOpen = signal(false);

  // Lista de bots gerenciados pelo painel
  bots = [
    { name: 'FortMeBot', type: 'Engajamento' },
    { name: 'GuardaOiBot', type: 'Moderação' },
    { name: 'BattleBusBot', type: 'Registro de Players' },
    { name: 'LojaFortniteBot', type: 'Loja e Alertas' },
    { name: 'FortCardsBot', type: 'Coleção de Cards' }
  ];

  selectedBot = signal(this.bots[0]);

  constructor(private router: Router) { }

  toggleNotificationsDropdown(event: Event) {
    event.stopPropagation();
    this.isNotificationsOpen.update(v => !v);
    this.isBotDropdownOpen.set(false);
    this.isProfileDropdownOpen.set(false);
  }

  toggleBotDropdown(event: Event) {
    event.stopPropagation();
    this.isBotDropdownOpen.update(v => !v);
    this.isProfileDropdownOpen.set(false);
    this.isNotificationsOpen.set(false);
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.isProfileDropdownOpen.update(v => !v);
    this.isBotDropdownOpen.set(false);
    this.isNotificationsOpen.set(false);
  }

  selectBot(bot: typeof this.bots[0]) {
    this.selectedBot.set(bot);
    this.isBotDropdownOpen.set(false);
  }

  fazerLogout() {
    this.router.navigate(['/login']);
  }
}