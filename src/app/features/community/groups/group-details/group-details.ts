import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SharedTabsComponent, TabItem } from '../../../../shared/components/shared-tabs/shared-tabs';
import { TextEditorComponent } from '../../../../shared/components/text-editor/text-editor';
import { GROUP_MESSAGES_MOCK, GROUP_SETTINGS_MOCK } from '../../../../core/mocks/group.mock';
import { 
  LucideAngularModule, ArrowLeft, Edit2, Copy, Calendar, User, Globe, Users, Hash, 
  Send, RefreshCw, Settings, Lock, AlertTriangle, MessageSquare, Shield, Activity, 
  Trash2, Link, LogIn, LogOut, CheckCircle, Plus, Minus, ChevronDown, Check, Info, 
  FileText, Menu, Eye, Moon, Zap, ShieldAlert, X, Bot
} from 'lucide-angular';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, SharedTabsComponent, TextEditorComponent, RouterLink],
  templateUrl: './group-details.html'
})
export class GroupDetailsComponent implements OnInit {
  // Controle de Abas
  activeTab = signal('configuracoes');
  groupTabs: TabItem[] = [
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'permissoes', label: 'Permissões', icon: Lock },
    { id: 'warns', label: 'Warns', icon: AlertTriangle },
    { id: 'mensagens', label: 'Mensagens', icon: MessageSquare },
    { id: 'deteccao', label: 'Detecção Automática', icon: Zap },
    { id: 'logs', label: 'Logs de Ações', icon: Activity }
  ];

  // Controle de Switches (Ativos/Inativos) - Inicializados via Mock
  switches = {
    botStatus: signal(false),
    antiSpam: signal(false),
    antiLinks: signal(false),
    antiFlood: signal(false),
    antiCaps: signal(false),
    detectRusso: signal(false),
    detectArabe: signal(false),
    detectOriental: signal(false)
  };

  // Selects e Inputs de Configuração
  banType = signal<'permanente' | 'temporario'>('temporario');
  preWarnAction = signal<'nada' | 'silenciar_perm' | 'silenciar_temp'>('silenciar_temp');

  // Controle do Editor de Texto
  editor = {
    isOpen: signal(false),
    title: signal(''),
    content: signal(''),
    fieldId: signal('')
  };

  // Armazenamento das mensagens carregadas
  messages: Record<string, string> = {};

  // Ícones (Mantidos iguais)
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
  readonly X = X; readonly Bot = Bot;

  ngOnInit() {
    this.loadGroupData();
  }

  // Simulação de requisição HTTP (carregando do Mock)
  private loadGroupData() {
    // Carrega mensagens
    this.messages = { ...GROUP_MESSAGES_MOCK };

    // Carrega configurações nos signals
    this.switches.botStatus.set(GROUP_SETTINGS_MOCK.botStatus);
    this.switches.antiSpam.set(GROUP_SETTINGS_MOCK.antiSpam);
    this.switches.antiLinks.set(GROUP_SETTINGS_MOCK.antiLinks);
    this.switches.antiFlood.set(GROUP_SETTINGS_MOCK.antiFlood);
    this.switches.antiCaps.set(GROUP_SETTINGS_MOCK.antiCaps);
    this.switches.detectRusso.set(GROUP_SETTINGS_MOCK.detectRusso);
    this.switches.detectArabe.set(GROUP_SETTINGS_MOCK.detectArabe);
    this.switches.detectOriental.set(GROUP_SETTINGS_MOCK.detectOriental);
    
    this.banType.set(GROUP_SETTINGS_MOCK.banType);
    this.preWarnAction.set(GROUP_SETTINGS_MOCK.preWarnAction);
  }

  // Funções da tela
  toggleSwitch(key: keyof typeof this.switches) {
    this.switches[key].update(v => !v);
  }

  openEditor(fieldId: string, title: string) {
    this.editor.fieldId.set(fieldId);
    this.editor.title.set(title);
    this.editor.content.set(this.messages[fieldId] || '');
    this.editor.isOpen.set(true);
  }

 saveEditor(eventData: { content: string, imageBase64: string | null }) {
    this.messages[this.editor.fieldId()] = eventData.content;
    this.editor.isOpen.set(false);
  }
}