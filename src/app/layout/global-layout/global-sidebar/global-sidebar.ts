import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout.service';
import { 
  LucideAngularModule, Home, Bot, ShieldAlert, Bus, ShoppingCart, WalletCards,
  Users, Star, Megaphone, Gift, HelpCircle, Terminal, Settings, Link, FileText, Sparkles
} from 'lucide-angular';

@Component({
  selector: 'app-global-sidebar',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './global-sidebar.html'
})
export class GlobalSidebarComponent {
  layoutService = inject(LayoutService);  
  readonly Home = Home;
  readonly Bot = Bot;
  readonly ShieldAlert = ShieldAlert;
  readonly Bus = Bus;
  readonly ShoppingCart = ShoppingCart;
  readonly WalletCards = WalletCards;
  readonly Users = Users;
  readonly Star = Star;
  readonly Megaphone = Megaphone;
  readonly Gift = Gift;
  readonly HelpCircle = HelpCircle;
  readonly Terminal = Terminal;
  readonly Settings = Settings;
  readonly Link = Link;
  readonly FileText = FileText;
  readonly Sparkles = Sparkles;
}