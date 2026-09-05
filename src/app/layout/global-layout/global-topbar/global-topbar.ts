import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout.service';
import { SessionService } from '../../../core/auth/session.service';
import { LucideAngularModule, Menu, Bot, Bell, ChevronDown, Check, LogOut, Settings, User, Search } from 'lucide-angular';

@Component({
  selector: 'app-global-topbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './global-topbar.html'
})
export class GlobalTopbarComponent {
  layoutService = inject(LayoutService);
  sessionService = inject(SessionService);
  private router = inject(Router);
  
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

  // Dados dinâmicos puxados da sessão (Backend)
  bots = this.sessionService.botsAccess;
  currentUser = this.sessionService.currentUser;
  notificationsCount = this.sessionService.notificationsCount;

  // Controle de bot selecionado
  private manualSelectedBot = signal<any>(null);

  // Signal computado: Retorna o bot selecionado manualmente ou, por padrão, o primeiro da lista
  activeBot = computed(() => {
    const selected = this.manualSelectedBot();
    if (selected) return selected;
    const available = this.bots();
    return available.length > 0 ? available[0] : null;
  });

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

  selectBot(bot: any) {
    this.manualSelectedBot.set(bot);
    this.isBotDropdownOpen.set(false);
    
    // Navega dinamicamente para a rota do bot cadastrada no banco de dados
    if (bot.route) {
      this.router.navigate([bot.route]);
    }
  }

  fazerLogout() {
    this.router.navigate(['/login']);
  }
}