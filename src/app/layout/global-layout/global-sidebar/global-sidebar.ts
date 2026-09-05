import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout.service';
import { SessionService } from '../../../core/auth/session.service';
import { LucideAngularModule } from 'lucide-angular';
import * as LucideIcons from 'lucide-angular';

@Component({
  selector: 'app-global-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive, 
    LucideAngularModule
  ],
  templateUrl: './global-sidebar.html'
})
export class GlobalSidebarComponent {
  layoutService = inject(LayoutService);  
  private sessionService = inject(SessionService);

  readonly Sparkles = LucideIcons.Sparkles;
  readonly Star = LucideIcons.Star;
  readonly Bot = LucideIcons.Bot;

  // Dicionário dinâmico em tempo de execução baseado em todo o pacote Lucide
  readonly iconMap: Record<string, any> = LucideIcons;

  navigation = this.sessionService.navigation;
  bots = this.sessionService.botsAccess;

  getIcon(iconName?: string) {
    if (!iconName) return this.Bot;
    return this.iconMap[iconName] || this.Bot;
  }

  getBotColorClasses(color?: string): { bg: string, text: string } {
    const colorMap: Record<string, { bg: string, text: string }> = {
      'blue': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
      'cyan': { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
      'yellow': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
      'purple': { bg: 'bg-purple-600/20', text: 'text-purple-400' }
    };
    return colorMap[color || 'purple'] || colorMap['purple'];
  }
}