import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GroupsService, GroupSummary } from '../../../../core/api/generated';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import {
  LucideAngularModule, Menu, Search, ChevronDown, LayoutGrid, List as ListIcon,
  Users, Star, Megaphone, Gift, ShieldAlert, Bus, Bot, ShoppingCart,
  Plus, ArrowRight, Shield, Info, UserPlus, X,
  Sword, Crosshair, Bomb, Zap, Trophy, Crown, Flame, Sparkles,
  MessageSquare, Mic, Heart, Gamepad2, Headphones, Tv, Target, Map
} from 'lucide-angular';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './groups-list.html'
})
export class GroupsListComponent implements OnInit {
  private groupService = inject(GroupsService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  readonly Menu = Menu; readonly Search = Search; readonly ChevronDown = ChevronDown;
  readonly LayoutGrid = LayoutGrid; readonly ListIcon = ListIcon; readonly Users = Users;
  readonly Star = Star; readonly Megaphone = Megaphone; readonly Gift = Gift;
  readonly ShieldAlert = ShieldAlert; readonly Bus = Bus; readonly Bot = Bot;
  readonly ShoppingCart = ShoppingCart; readonly Plus = Plus; readonly ArrowRight = ArrowRight;
  readonly Shield = Shield; readonly Info = Info; readonly UserPlus = UserPlus;
  readonly X = X;

  // --- ESTADO BASE ---
  communityGroups = signal<any[]>([]);
  thirdPartyGroups = signal<any[]>([]);
  isLoading = signal(true);
  isCreateModalOpen = signal(false);
  isCreating = signal(false);

  // --- FILTROS E VIEW MODE (REATIVIDADE) ---
  searchQuery = signal('');
  selectedCategory = signal('Todas');
  selectedLanguage = signal('Todos');
  sortRule = signal('Mais ativos');
  viewMode = signal<'grid' | 'list'>('grid');

  // Limites para expansão Inline
  officialLimit = signal(6);
  thirdPartyLimit = signal(6);

  // --- COMPUTED SIGNALS (Filtros instantâneos) ---
  filteredCommunityGroups = computed(() => this.applyFilters(this.communityGroups()));
  filteredThirdPartyGroups = computed(() => this.applyFilters(this.thirdPartyGroups()));

  // --- FORMULÁRIO DE CRIAÇÃO ---
  groupName = '';
  groupDescription = '';
  groupMode = 'Geral';
  groupLanguage = 'pt-BR'; // Adicionado
  isVip = false;
  groupIcon = 'Users';
  coverImagePreview: string | null = null;
  themeColor = '#9333ea';
  platformId = signal('');
  groupType = signal<'group' | 'channel'>('group');
  moderationBots = signal<any[]>([]);
  selectedBotId = signal<string>('');
  enableBot = signal<boolean>(true);

  availableModes = signal<{ id: number, name: string }[]>([]);
  presetColors = ['#9333ea', '#3b82f6', '#06b6d4', '#10b981', '#eab308', '#f97316', '#ef4444', '#ec4899', '#64748b'];
  availableIcons = [
    'Users', 'Star', 'Megaphone', 'Gift', 'ShieldAlert', 'Bus', 'Bot', 'ShoppingCart',
    'Sword', 'Crosshair', 'Shield', 'Bomb', 'Zap', 'Target', 'Trophy', 'Crown', 'Flame', 
    'Sparkles', 'MessageSquare', 'Mic', 'Heart', 'Gamepad2', 'Headphones', 'Tv', 'Map'
  ];

  isDragging = false;

  private toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
    timerProgressBar: true, background: '#130d24', color: '#ffffff',
    customClass: { popup: 'border border-gray-800 rounded-xl shadow-2xl' }
  });

  ngOnInit() {
    this.loadGroups();
    this.loadModes();
    this.loadModerationBots(); 
  }

  getIcon(iconName: string | null | undefined) {
    const icons: Record<string, any> = {
      'Users': Users, 'Star': Star, 'Megaphone': Megaphone, 'Gift': Gift,
      'ShieldAlert': ShieldAlert, 'Bus': Bus, 'Bot': Bot, 'ShoppingCart': ShoppingCart,
      'Sword': Sword, 'Crosshair': Crosshair, 'Shield': Shield, 'Bomb': Bomb, 'Zap': Zap, 'Target': Target,
      'Trophy': Trophy, 'Crown': Crown, 'Flame': Flame, 'Sparkles': Sparkles,
      'MessageSquare': MessageSquare, 'Mic': Mic, 'Heart': Heart,
      'Gamepad2': Gamepad2, 'Headphones': Headphones, 'Tv': Tv, 'Map': Map
    };
    return iconName && icons[iconName] ? icons[iconName] : Users;
  }

  // --- LÓGICA DE FILTRAGEM ---
  private applyFilters(groups: any[]) {
    let result = [...groups];

    const search = this.searchQuery().toLowerCase();
    if (search) {
      result = result.filter(g => g.name.toLowerCase().includes(search) || g.desc?.toLowerCase().includes(search));
    }

    const cat = this.selectedCategory();
    if (cat !== 'Todas') {
      result = result.filter(g => g.mode === cat);
    }

    const lang = this.selectedLanguage();
    if (lang !== 'Todos') {
      result = result.filter(g => g.language === lang);
    }

    const sort = this.sortRule();
    if (sort === 'Mais ativos') {
      result.sort((a, b) => b.online - a.online);
    } else if (sort === 'Menos ativos') {
      result.sort((a, b) => a.online - b.online);
    } else if (sort === 'A-Z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }

  openCreateModal() { this.isCreateModalOpen.set(true); }

  setGroupType(type: 'group' | 'channel') {
    this.groupType.set(type);
    if (type === 'channel') {
      this.enableBot.set(false);
    } else {
      this.enableBot.set(true);
    }
  }

  private loadModerationBots() {
    this.http.get<any[]>(`${environment.apiUrl}/bots/moderation`).subscribe({
      next: (bots) => {
        this.moderationBots.set(bots);
        if (bots.length > 0) this.selectedBotId.set(bots[0].id);
      },
      error: (err) => console.error('Erro ao buscar bots moderadores', err)
    });
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
    this.isCreating.set(false);
    this.groupName = '';
    this.groupDescription = '';
    this.groupMode = 'Geral';
    this.groupLanguage = 'pt-BR'; // Reset
    this.isVip = false;
    this.groupIcon = 'Users';
    this.themeColor = '#9333ea';
    this.coverImagePreview = null;
    this.platformId.set('');
    this.setGroupType('group');
  }

  onDragOver(event: DragEvent) { event.preventDefault(); event.stopPropagation(); this.isDragging = true; }
  onDragLeave(event: DragEvent) { event.preventDefault(); event.stopPropagation(); this.isDragging = false; }
  onDrop(event: DragEvent) {
    event.preventDefault(); event.stopPropagation(); this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) this.processFile(file);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.coverImagePreview = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  private loadModes() {
    this.groupService.groupsModesGet().subscribe({
      next: (modes: any) => {
        this.availableModes.set(modes);
        if (modes.length > 0) this.groupMode = modes[0].name;
      },
      error: (err) => console.error('Erro ao buscar modos:', err)
    });
  }

  private loadGroups() {
    this.groupService.groupsGet().subscribe({
      next: (groups: GroupSummary[]) => {
        const serverUrl = environment.apiUrl.replace('/api/v1', '');

        const mappedGroups = groups.map(g => ({
          id: g.id,
          name: g.name,
          desc: g.description,
          cover: g.coverImageUrl ? `${serverUrl}${g.coverImageUrl}` : 'assets/image/header/main_header.png',
          online: g.onlineCount,
          members: g.memberCount,
          icon: this.getIcon(g.iconName ?? ''),
          mode: g.mode || 'Geral',
          language: g.language || 'pt-BR', // Mapeamento para os filtros funcionarem
          themeColor: g.themeColor || '#9333ea',
          isVip: g.isVip,
          link: `/groups/${g.id}`,
          hasBot: !!g.moderatorBot,
          botName: g.moderatorBot?.name || 'Sem Bot',
          botIcon: this.getIcon(g.moderatorBot?.iconName),
          botTheme: g.moderatorBot?.themeColor || '#6b7280',
          isOfficial: g.isOfficial
        }));

        this.communityGroups.set(mappedGroups.filter(g => g.isOfficial));
        this.thirdPartyGroups.set(mappedGroups.filter(g => !g.isOfficial));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar grupos:', err);
        this.isLoading.set(false);
      }
    });
  }

  saveNewGroup() {
    if (!this.groupName.trim() || !this.platformId().trim()) {
      this.toast.fire({ icon: 'warning', title: 'Nome e ID são obrigatórios.' });
      return;
    }

    this.isCreating.set(true);

    const payload = {
      platformId: this.platformId(),
      name: this.groupName,
      description: this.groupDescription || undefined,
      isOfficial: true,
      isVip: this.isVip,
      coverImageUrl: this.coverImagePreview || undefined,
      iconName: this.groupIcon,
      mode: this.groupMode,
      language: this.groupLanguage, // Enviado no payload
      themeColor: this.themeColor,
      type: this.groupType(),
      visibility: 'public' as const
    };

    this.groupService.groupsPost(payload as any).subscribe({
      next: (newGroup: any) => {
        if (this.groupType() === 'group' && this.enableBot() && this.selectedBotId()) {
          this.groupService.groupsGroupIdModerationBotsBotIdStatusPut(
            newGroup.id, 
            this.selectedBotId(),
            { isEnabled: true }
          ).subscribe({
            next: () => {
              this.toast.fire({ icon: 'success', title: 'Comunidade criada e protegida!' });
              this.loadGroups();
              this.closeCreateModal();
            },
            error: (err) => {
              this.toast.fire({ icon: 'warning', title: 'Comunidade criada, mas falha ao vincular o bot.' });
              this.loadGroups();
              this.closeCreateModal();
            }
          });
        } else {
          this.toast.fire({ icon: 'success', title: 'Comunidade registrada com sucesso!' });
          this.loadGroups();
          this.closeCreateModal();
        }
      },
      error: (err) => {
        this.toast.fire({ icon: 'error', title: err.error?.message || 'Erro ao criar a comunidade.' });
        this.isCreating.set(false);
      }
    });
  }
}