import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedTabsComponent, TabItem } from '../../../../shared/components/shared-tabs/shared-tabs';
import { TextEditorComponent } from '../../../../shared/components/text-editor/text-editor';
import { GroupsService, GroupDetail, ModerationBotStatus } from '../../../../core/api/generated';
import { environment } from '../../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { 
  LucideAngularModule, ArrowLeft, Edit2, Copy, Calendar, User, Globe, Users, Hash, 
  Send, RefreshCw, Settings, Lock, AlertTriangle, MessageSquare, Shield, Activity, 
  Trash2, Link, LogIn, LogOut, CheckCircle, Plus, Minus, ChevronDown, Check, Info, 
  FileText, Menu, Eye, Moon, Zap, ShieldAlert, X, Bot, ToggleLeft, ToggleRight,
  Trophy, Gamepad2, Sword, Target, Heart, UserPlus, Megaphone, Star, Music, Video, 
  Image as ImageIcon, Camera, Gift, Bus, ShoppingCart, Crosshair, Bomb, Crown, Flame, 
  Sparkles, Mic, Headphones, Tv, Map
} from 'lucide-angular';

const DEFAULT_BOT_CONFIG = {
  rulesCheck: { status: false, action: 'mute' },
  gifs: { status: false, count: 5, time: 10 },
  autoDetection: {
    russian: { status: false },
    arabic: { status: false },
    oriental: { status: false },
    globalAction: 'ban'
  },
  permissions: {
    general: { sendMessages: true, sendMedia: true, sendStickers: true, sendPolls: true, embedLinks: true, addUsers: true, pinMessages: false, changeInfo: false },
    newMembers: { sendMessages: true, sendMedia: false, sendStickers: false, sendPolls: false, embedLinks: false, addUsers: true, pinMessages: false, changeInfo: false },
    nightMode: { sendMessages: true, sendMedia: false, sendStickers: false, sendPolls: false, embedLinks: false, addUsers: false, pinMessages: false, changeInfo: false },
    restricted: { sendMessages: false, sendMedia: false, sendStickers: false, sendPolls: false, embedLinks: false, addUsers: false, pinMessages: false, changeInfo: false }
  },
  punishments: {
    warnLimit: 3,
    banType: 'temporario',
    banTimeHours: 24,
    preWarnAction: 'silenciar_temp',
    preWarnTimeHours: 1
  },
  messages: {
    welcome: '', welcomeNight: '', leave: '', warn: '', ban: ''
  },
  topic: {
    status: false,
    extra: null
  }
};

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, SharedTabsComponent, TextEditorComponent, RouterLink],
  templateUrl: './group-details.html'
})
export class GroupDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupsService);
  private http = inject(HttpClient);

  // --- ESTADO DO GRUPO ---
  currentGroupId = signal<string>('');
  groupInfo = signal<GroupDetail | null>(null);

  // --- DADOS DINÂMICOS ---
  availableModes = signal<any[]>([]);
  availableIcons = [
    'Users', 'Star', 'Megaphone', 'Gift', 'ShieldAlert', 'Bus', 'Bot', 'ShoppingCart',
    'Sword', 'Crosshair', 'Shield', 'Bomb', 'Zap', 'Target',
    'Trophy', 'Crown', 'Flame', 'Sparkles',
    'MessageSquare', 'Mic', 'Heart',
    'Gamepad2', 'Headphones', 'Tv', 'Map'
  ];

  // --- SIGNALS DE ESTRUTURA DO TELEGRAM ---
  isLinkedChannel = signal<boolean>(false);
  linkedChannelId = signal<string | null>(null);
  isForumMode = signal<boolean>(false);
  availableChannels = signal<any[]>([]);
  availableGroups = signal<any[]>([]);
  isSaving = signal<boolean>(false);

  // Controle de Bots Moderadores
  moderationBots = signal<ModerationBotStatus[]>([]);
  selectedBotId = signal<string>('');
  isBotEnabled = signal<boolean>(false);
  isLoadingBot = signal<boolean>(false);

  // Controle de Abas Dinâmicas (Morphing UI)
  activeTab = signal('configuracoes');
  private readonly BASE_TABS: TabItem[] = [
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'topicos', label: 'Tópicos (Fórum)', icon: Hash }, 
    { id: 'permissoes', label: 'Permissões', icon: Lock },
    { id: 'warns', label: 'Warns', icon: AlertTriangle },
    { id: 'mensagens', label: 'Mensagens', icon: MessageSquare },
    { id: 'deteccao', label: 'Detecção Automática', icon: Zap },
    { id: 'logs', label: 'Logs de Ações', icon: Activity }
  ];

  groupTabs = computed(() => {
    if (this.groupInfo()?.type === 'channel') {
      return this.BASE_TABS.filter(tab => tab.id === 'configuracoes');
    }
    if (this.isLinkedChannel()) {
      return this.BASE_TABS.filter(tab => tab.id !== 'topicos');
    }
    return this.BASE_TABS;
  });

  botConfig = signal<any>(null);

  editor = {
    isOpen: signal(false),
    title: signal(''),
    content: signal(''),
    fieldId: signal('')
  };

  // Ícones Lucide expostos
  readonly ArrowLeft = ArrowLeft; readonly Edit2 = Edit2; readonly Copy = Copy; 
  readonly Calendar = Calendar; readonly User = User; readonly Globe = Globe; 
  readonly Users = Users; readonly Hash = Hash; readonly Send = Send; 
  readonly RefreshCw = RefreshCw; readonly Settings = Settings; readonly Lock = Lock; 
  readonly AlertTriangle = AlertTriangle; readonly MessageSquare = MessageSquare; 
  readonly Shield = Shield; readonly Activity = Activity; readonly Trash2 = Trash2; 
  readonly Link = Link; readonly LogIn = LogIn; readonly LogOut = LogOut; 
  readonly CheckCircle = CheckCircle; readonly Plus = Plus; readonly Minus = Minus; 
  readonly ChevronDown = ChevronDown; readonly Check = Check; readonly Info = Info; 
  readonly FileText = FileText; readonly Menu = Menu; readonly Eye = Eye; 
  readonly Moon = Moon; readonly Zap = Zap; readonly ShieldAlert = ShieldAlert; 
  readonly X = X; readonly Bot = Bot; readonly ToggleLeft = ToggleLeft; readonly ToggleRight = ToggleRight;
  readonly Trophy = Trophy; readonly Gamepad2 = Gamepad2; readonly Sword = Sword; 
  readonly Target = Target; readonly Heart = Heart; readonly UserPlus = UserPlus;
  readonly Camera = Camera;

  private toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
    timerProgressBar: true, background: '#130d24', color: '#ffffff',
    customClass: { popup: 'border border-gray-800 rounded-xl shadow-2xl' }
  });

  ngOnInit() {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.currentGroupId.set(groupId);
      this.loadGroupInfo(groupId);
      this.loadModerationBots(groupId);
    }
    this.loadModes();
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

  onCoverImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.groupInfo.update(g => g ? { ...g, coverImageUrl: base64Image } : null);
      };
      reader.readAsDataURL(file);
    }
  }

  private loadModes() {
    this.groupService.groupsModesGet().subscribe({
      next: (modes: any) => this.availableModes.set(modes),
      error: (err) => console.error('Erro ao carregar modos', err)
    });
  }

  private loadGroupInfo(id: string) {
    this.groupService.groupsGroupIdGet(id).subscribe({
      next: (group: any) => { 
        const serverUrl = environment.apiUrl.replace('/api/v1', '');
        if (group.coverImageUrl && !group.coverImageUrl.startsWith('data:image')) {
          group.coverImageUrl = `${serverUrl}${group.coverImageUrl}`;
        } else if (!group.coverImageUrl) {
          group.coverImageUrl = 'assets/image/header/main_header.png';
        }
        
        this.groupInfo.set(group);
        this.isForumMode.set(group.isForum || false);
        this.isLinkedChannel.set(group.isLinkedToChannel || false);
        this.linkedChannelId.set(group.linkedChannelId || null);

        if (group.type === 'group') {
          this.loadAvailableChannels();
        } else if (group.type === 'channel') {
          this.loadAvailableGroups();
        }
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes da comunidade', err);
        this.toast.fire({ icon: 'error', title: 'Erro ao carregar os dados' });
      }
    });
  }

  loadAvailableChannels() {
    const url = `${environment.apiUrl}/groups/channels/available?currentGroupId=${this.currentGroupId()}`;
    this.http.get<any[]>(url).subscribe({
      next: (channels) => this.availableChannels.set(channels),
      error: (err) => console.error('Erro ao carregar canais disponíveis', err)
    });
  }

  loadAvailableGroups() {
    const url = `${environment.apiUrl}/groups/available-groups?currentChannelId=${this.currentGroupId()}`;
    this.http.get<any[]>(url).subscribe({
      next: (groups) => this.availableGroups.set(groups),
      error: (err) => console.error('Erro ao carregar grupos disponíveis', err)
    });
  }

  toggleChannelLink() {
    if (this.isForumMode()) return; 
    this.isLinkedChannel.set(!this.isLinkedChannel());
    
    if (this.isLinkedChannel() && this.activeTab() === 'topicos') {
      this.activeTab.set('configuracoes');
    }
    if (!this.isLinkedChannel()) {
      this.linkedChannelId.set(null);
    }
  }

  toggleForumMode() {
    if (this.isLinkedChannel()) return;
    this.isForumMode.set(!this.isForumMode());
  }

  private mergeConfigWithDefaults(dbConfig: any) {
    if (!dbConfig) return JSON.parse(JSON.stringify(DEFAULT_BOT_CONFIG));
    return {
      rulesCheck: { ...DEFAULT_BOT_CONFIG.rulesCheck, ...dbConfig.rulesCheck },
      gifs: { ...DEFAULT_BOT_CONFIG.gifs, ...dbConfig.gifs },
      autoDetection: { ...DEFAULT_BOT_CONFIG.autoDetection, ...dbConfig.autoDetection },
      permissions: {
        general: { ...DEFAULT_BOT_CONFIG.permissions.general, ...dbConfig.permissions?.general },
        newMembers: { ...DEFAULT_BOT_CONFIG.permissions.newMembers, ...dbConfig.permissions?.newMembers },
        nightMode: { ...DEFAULT_BOT_CONFIG.permissions.nightMode, ...dbConfig.permissions?.nightMode },
        restricted: { ...DEFAULT_BOT_CONFIG.permissions.restricted, ...dbConfig.permissions?.restricted }
      },
      punishments: { ...DEFAULT_BOT_CONFIG.punishments, ...dbConfig.punishments },
      messages: { ...DEFAULT_BOT_CONFIG.messages, ...dbConfig.messages },
      topic: { ...DEFAULT_BOT_CONFIG.topic, ...dbConfig.topic } 
    };
  }

  updateBotConfigField(section: string, field: string, value: any) {
    if (!this.isBotEnabled()) return;
    const config = this.botConfig() || this.mergeConfigWithDefaults(null);
    if (!config[section]) config[section] = {};
    config[section][field] = value;
    this.botConfig.set({ ...config });
  }

  toggleDetectionFilter(type: 'russian' | 'arabic' | 'oriental') {
    if (!this.isBotEnabled()) return;
    const config = this.botConfig() || this.mergeConfigWithDefaults(null);
    config.autoDetection[type].status = !config.autoDetection[type].status;
    this.botConfig.set({ ...config });
  }

  togglePermission(group: 'general' | 'newMembers' | 'nightMode' | 'restricted', field: string) {
    if (!this.isBotEnabled()) return;
    const config = this.botConfig() || this.mergeConfigWithDefaults(null);
    config.permissions[group][field] = !config.permissions[group][field];
    this.botConfig.set({ ...config });
  }

  updatePunishment(field: string, value: any) {
    if (!this.isBotEnabled()) return;
    const config = this.botConfig() || this.mergeConfigWithDefaults(null);
    if (typeof value === 'number' && value < 0) value = 0;
    config.punishments[field] = value;
    this.botConfig.set({ ...config });
  }

  // --- GERENCIAMENTO DE TÓPICOS (Dicionário Numérico do Telegram) ---
  
  getTopicList() {
    const config = this.botConfig();
    if (!config || !config.topic) return [];
    
    return Object.keys(config.topic)
      .filter(key => key !== 'status' && key !== 'extra')
      .map(key => ({
         key,
         ...config.topic[key]
      }));
  }

  createNewTopic() {
    if (!this.isBotEnabled() || !this.selectedBotId()) return;

    Swal.fire({
      title: 'Adicionar Tópico',
      html: `
        <div class="space-y-4 pt-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-left">Nome do Tópico</label>
            <input id="swal-topic-name" class="w-full bg-[#06040e] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="Ex: Warns, Welcome...">
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-left">ID no Telegram</label>
            <input id="swal-topic-id" type="number" class="w-full bg-[#06040e] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="Ex: 5">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Adicionar',
      cancelButtonText: 'Cancelar',
      background: '#130d24', color: '#ffffff',
      customClass: { popup: 'border border-gray-800 rounded-xl shadow-2xl' },
      preConfirm: () => {
        const name = (document.getElementById('swal-topic-name') as HTMLInputElement).value;
        const id = (document.getElementById('swal-topic-id') as HTMLInputElement).value;
        if (!name || !id) {
          Swal.showValidationMessage('Nome e ID são obrigatórios!');
          return false;
        }
        return { name, id: parseInt(id, 10) };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, id } = result.value;
        const config = this.botConfig() || this.mergeConfigWithDefaults(null);
        if (!config.topic) config.topic = { status: true, extra: null };

        config.topic[id.toString()] = { name, id, status: 'open' };
        
        this.botConfig.set({ ...config });
      }
    });
  }

  editTopic(topic: any) {
    if (!this.isBotEnabled() || !this.selectedBotId()) return;

    Swal.fire({
      title: 'Editar Tópico',
      html: `
        <div class="space-y-4 pt-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-left">Nome do Tópico</label>
            <input id="swal-edit-name" value="${topic.name}" class="w-full bg-[#06040e] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500">
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-left">ID no Telegram</label>
            <input id="swal-edit-id" type="number" value="${topic.id}" class="w-full bg-[#06040e] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Salvar Alterações',
      cancelButtonText: 'Cancelar',
      background: '#130d24', color: '#ffffff',
      customClass: { popup: 'border border-gray-800 rounded-xl shadow-2xl' },
      preConfirm: () => {
        const name = (document.getElementById('swal-edit-name') as HTMLInputElement).value;
        const id = (document.getElementById('swal-edit-id') as HTMLInputElement).value;
        if (!name || !id) {
          Swal.showValidationMessage('Nome e ID são obrigatórios!');
          return false;
        }
        return { name, id: parseInt(id, 10) };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, id } = result.value;
        const config = this.botConfig();
        
        if (topic.key !== id.toString()) {
           const currentStatus = config.topic[topic.key].status;
           delete config.topic[topic.key];
           config.topic[id.toString()] = { name, id, status: currentStatus };
        } else {
           config.topic[topic.key].name = name;
        }
        
        this.botConfig.set({ ...config });
      }
    });
  }

  deleteTopic(topicKey: string, topicName: string) {
    if (!this.isBotEnabled() || !this.selectedBotId()) return;

    Swal.fire({
      title: 'Excluir Tópico?',
      text: `Tem certeza que deseja remover o tópico "${topicName}" das configurações?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      background: '#130d24', color: '#ffffff',
      customClass: { popup: 'border border-gray-800 rounded-xl shadow-2xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        const config = this.botConfig();
        if (config && config.topic && config.topic[topicKey]) {
          delete config.topic[topicKey];
          this.botConfig.set({ ...config });
        }
      }
    });
  }

  toggleTopicStatus(topicKey: string, currentStatus: string) {
    if (!this.isBotEnabled() || !this.selectedBotId()) return;
    
    const config = this.botConfig();
    if (config && config.topic && config.topic[topicKey]) {
        config.topic[topicKey].status = currentStatus === 'open' ? 'close' : 'open';
        this.botConfig.set({ ...config });
    }
  }

  // --- SALVAMENTO EM LOTE ---
  saveAllSettings() {
    this.isSaving.set(true);

    const batchPayload: any = {
      name: this.groupInfo()?.name,
      description: this.groupInfo()?.description,
      language: this.groupInfo()?.language,
      mode: this.groupInfo()?.mode,
      visibility: this.groupInfo()?.visibility,
      themeColor: this.groupInfo()?.themeColor,
      iconName: this.groupInfo()?.iconName,
      coverImageUrl: this.groupInfo()?.coverImageUrl, 
      type: this.groupInfo()?.type,
      isLinkedToChannel: this.isLinkedChannel(),
      linkedChannelId: this.isLinkedChannel() ? this.linkedChannelId() : null,
      isForum: this.isForumMode()
    };

    // Salva o grupo
    this.groupService.groupsGroupIdPut(this.currentGroupId(), batchPayload).subscribe({
      next: () => {
        // Salva as configurações do bot
        if (this.groupInfo()?.type === 'group' && this.isBotEnabled() && this.botConfig() && this.selectedBotId()) {
          this.groupService.groupsGroupIdModerationBotsBotIdConfigPut(
            this.currentGroupId(), 
            this.selectedBotId(), 
            this.botConfig()
          ).subscribe({
            next: () => {
              this.isSaving.set(false);
              this.toast.fire({ icon: 'success', title: 'Configurações polidas e salvas!' });
            },
            error: (err) => {
              this.isSaving.set(false);
              this.toast.fire({ icon: 'warning', title: 'Grupo salvo, erro ao atualizar o Bot.' });
            }
          });
        } else {
          this.isSaving.set(false);
          this.toast.fire({ icon: 'success', title: 'Comunidade atualizada com sucesso!' });
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        this.toast.fire({ icon: 'error', title: 'Erro ao processar alterações.' });
      }
    });
  }

  confirmDeleteGroup() {
    Swal.fire({
      title: 'Excluir Comunidade?',
      text: "Esta ação desativará a comunidade no painel e interromperá as integrações. É irreversível.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      background: '#130d24',
      color: '#ffffff',
      customClass: { popup: 'border border-red-500/20 rounded-2xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.groupService.groupsGroupIdDelete(this.currentGroupId()).subscribe({
          next: () => {
            this.toast.fire({ icon: 'success', title: 'Comunidade removida.' });
            this.router.navigate(['/groups']);
          },
          error: (err) => {
            console.error(err);
            this.toast.fire({ icon: 'error', title: 'Falha ao excluir a comunidade.' });
          }
        });
      }
    });
  }

  // --- GERENCIAMENTO DO BOT ---
  private loadModerationBots(groupId: string) {
    this.groupService.groupsGroupIdModerationBotsGet(groupId).subscribe({
      next: (bots) => {
        this.moderationBots.set(bots);
        if (bots.length > 0) {
          const activeBot = bots.find(b => b.isEnabled) || bots[0];
          this.selectBot(activeBot.id!);
        }
      },
      error: (err) => console.error('Erro ao buscar bots', err)
    });
  }

  selectBot(botId: string) {
    this.selectedBotId.set(botId);
    const bot = this.moderationBots().find(b => b.id === botId);
    this.isBotEnabled.set(bot?.isEnabled || false);
    
    if (this.isBotEnabled()) {
      this.loadBotConfig(botId);
    } else {
      this.botConfig.set(null);
    }
  }

  toggleMasterBotStatus() {
    const groupId = this.currentGroupId();
    const botId = this.selectedBotId();
    if (!groupId || !botId) return;

    const newState = !this.isBotEnabled();
    this.isLoadingBot.set(true);

    this.groupService.groupsGroupIdModerationBotsBotIdStatusPut(groupId, botId, { isEnabled: newState }).subscribe({
      next: () => {
        this.isBotEnabled.set(newState);
        this.isLoadingBot.set(false);
        this.moderationBots.update(bots => bots.map(b => b.id === botId ? { ...b, isEnabled: newState } : b));

        if (newState) {
          this.loadBotConfig(botId);
        } else {
          this.botConfig.set(null);
        }
      },
      error: (err) => {
        console.error('Erro ao alterar status', err);
        this.isLoadingBot.set(false);
        this.toast.fire({ icon: 'error', title: 'Erro de comunicação.' });
      }
    });
  }

  private loadBotConfig(botId: string) {
    const groupId = this.currentGroupId();
    this.groupService.groupsGroupIdModerationBotsBotIdConfigGet(groupId, botId).subscribe({
      next: (config) => {
        this.botConfig.set(this.mergeConfigWithDefaults(config));
      },
      error: (err) => console.error('Erro ao buscar config', err)
    });
  }

  // --- EDITOR DE MENSAGENS ---
  openEditor(fieldId: string, title: string) {
    if (!this.isBotEnabled() && fieldId !== 'description') return; 
    
    this.editor.fieldId.set(fieldId);
    this.editor.title.set(title);
    
    if (fieldId === 'description') {
      this.editor.content.set(this.groupInfo()?.description || '');
    } else {
      const config = this.botConfig() || this.mergeConfigWithDefaults(null);
      this.editor.content.set(config.messages[fieldId] || '');
    }
    
    this.editor.isOpen.set(true);
  }

  saveEditor(eventData: { content: string, imageBase64: string | null }) {
    if (this.editor.fieldId() === 'description') {
      this.groupInfo.update(g => g ? { ...g, description: eventData.content } : null);
    } else {
      const config = this.botConfig() || this.mergeConfigWithDefaults(null);
      config.messages[this.editor.fieldId()] = eventData.content;
      this.botConfig.set({ ...config });
    }
    this.editor.isOpen.set(false);
  }
}