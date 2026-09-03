import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Inicializando como true para que a sidebar já apareça aberta no desktop
  isSidebarOpen = signal(true); 

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }
}