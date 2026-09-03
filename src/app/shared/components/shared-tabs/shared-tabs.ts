import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface TabItem {
  id: string;
  label: string;
  icon?: any; // Referência do ícone Lucide
}

@Component({
  selector: 'app-shared-tabs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex items-center gap-6 border-b border-gray-800/50 mb-6 overflow-x-auto custom-scrollbar pb-1">
      @for (tab of tabs; track tab.id) {
        <button 
          (click)="selectTab(tab.id)"
          [class]="activeTabId === tab.id 
            ? 'flex items-center gap-2 pb-3 border-b-2 border-purple-500 text-purple-400 font-semibold shrink-0 transition-colors' 
            : 'flex items-center gap-2 pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-300 font-medium shrink-0 transition-colors'">
          
          @if (tab.icon) {
            <lucide-icon [img]="tab.icon" class="h-4 w-4"></lucide-icon>
          }
          {{ tab.label }}
        </button>
      }
    </div>
  `
})
export class SharedTabsComponent {
  @Input({ required: true }) tabs: TabItem[] = [];
  @Input({ required: true }) activeTabId: string = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(id: string) {
    this.tabChange.emit(id);
  }
}