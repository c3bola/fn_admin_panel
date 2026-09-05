import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UserContext {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  role: string;
}

export interface BotAccess {
  id: string;
  name: string;
  category: string;
  status: string;
  is_active: boolean;
  route: string;
  icon?: string;          // Adicionado
  theme_color?: string;   // Adicionado
}

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  permission: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  currentUser = signal<UserContext | null>(null);
  botsAccess = signal<BotAccess[]>([]);
  navigation = signal<NavSection[]>([]);
  notificationsCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  loadSessionContext() {
  return this.http.get<any>(`${environment.apiUrl.trim()}/auth/me`).pipe(
    tap(response => {
      this.currentUser.set(response.user);
      this.botsAccess.set(response.bots_access);
      
      // FILTRAGEM NO FRONTEND: Garante que apenas códigos iniciados com 'main.' 
      // formem a navegação global (GERAL, COMUNIDADE, SISTEMA), ignorando 'bot.*'
      const rawNavigation = response.navigation || [];
      const filteredNavigation = rawNavigation.map((section: any) => ({
        ...section,
        items: section.items.filter((item: any) => {
          // Se o item tiver uma propriedade de código ou rota, filtramos por 'main'
          return item.route?.startsWith('/admin/') && !item.route.includes('/bots/');
        })
      })).filter((section: any) => section.items.length > 0);

      this.navigation.set(filteredNavigation);
      this.notificationsCount.set(response.notifications_count || 0);
    })
  );
}

  clearSession() {
    this.currentUser.set(null);
    this.botsAccess.set([]);
    this.navigation.set([]);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
}