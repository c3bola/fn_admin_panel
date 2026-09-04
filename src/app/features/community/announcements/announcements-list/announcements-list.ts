import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, Menu, Search, Megaphone, Send, Clock, 
  CheckCircle, Users, Bot, MessageSquare, Plus, X, Calendar, 
  Eye, FileText, ChevronDown, CheckSquare, Square
} from 'lucide-angular';

interface CommunityAsset {
  id: string;
  name: string;
  type: 'group' | 'bot' | 'channel';
  selected: boolean;
}

interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  status: 'Enviado' | 'Agendado' | 'Rascunho';
  targets: string[];
  views: number;
}

@Component({
  selector: 'app-announcements-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './announcements-list.html'
})
export class AnnouncementsListComponent {
  readonly Menu = Menu; readonly Search = Search; readonly Megaphone = Megaphone; 
  readonly Send = Send; readonly Clock = Clock; readonly CheckCircle = CheckCircle; 
  readonly Users = Users; readonly Bot = Bot; readonly MessageSquare = MessageSquare; 
  readonly Plus = Plus; readonly X = X; readonly Calendar = Calendar; 
  readonly Eye = Eye; readonly FileText = FileText; readonly ChevronDown = ChevronDown;
  readonly CheckSquare = CheckSquare; readonly Square = Square;

  // Estatísticas
  stats = {
    totalSent: 42,
    totalReach: '45.2K',
    scheduled: 2
  };

  // Histórico de Comunicados
  announcements = signal<Announcement[]>([
    {
      id: '1', title: 'Manutenção no Bot de Loja', excerpt: 'Aviso rápido: O bot de loja passará por manutenção hoje às 00h...',
      date: 'Ontem, 18:30', status: 'Enviado', targets: ['LojaFortniteBot', 'Fortnite Brasil'], views: 12500
    },
    {
      id: '2', title: 'Sorteio de V-Bucks - Resultado!', excerpt: 'O grande vencedor do sorteio mensal do Clubinho foi o...',
      date: '28/08/2026, 15:00', status: 'Enviado', targets: ['Clubinho VIP', 'Fortnite Brasil'], views: 8430
    },
    {
      id: '3', title: 'Nova Temporada de Fortnite - Regras', excerpt: 'Com a chegada da nova temporada, atualizamos as regras de spoiler...',
      date: '02/09/2026, 10:00', status: 'Agendado', targets: ['Fortnite Salve o Mundo', 'Fortnite Brasil'], views: 0
    }
  ]);

  // Controle do Modal de Novo Aviso
  isModalOpen = signal(false);
  
  // Formulário
  newAnnouncement = {
    title: '',
    content: '',
    schedule: false,
    scheduleDate: ''
  };

  // Ativos disponíveis para envio
  assets = signal<CommunityAsset[]>([
    { id: 'g1', name: 'Fortnite Brasil (Oficial)', type: 'group', selected: false },
    { id: 'g2', name: 'Fortnite Salve o Mundo', type: 'group', selected: false },
    { id: 'c1', name: 'Clubinho VIP (Avisos)', type: 'channel', selected: false },
    { id: 'b1', name: 'FortMeBot (Broadcast)', type: 'bot', selected: false },
    { id: 'b2', name: 'LojaFortniteBot (Alertas)', type: 'bot', selected: false }
  ]);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  toggleAssetSelection(id: string) {
    this.assets.update(list => 
      list.map(asset => asset.id === id ? { ...asset, selected: !asset.selected } : asset)
    );
  }

  selectAllAssets(type?: 'group' | 'bot' | 'channel') {
    this.assets.update(list => 
      list.map(asset => {
        if (!type || asset.type === type) return { ...asset, selected: true };
        return asset;
      })
    );
  }

  get selectedAssetsCount() {
    return this.assets().filter(a => a.selected).length;
  }

  sendAnnouncement() {
    // Aqui entrará a integração futura com a API NodeJS
    console.log('Enviando comunicado...', {
      ...this.newAnnouncement,
      targets: this.assets().filter(a => a.selected)
    });
    this.closeModal();
  }

  resetForm() {
    this.newAnnouncement = { title: '', content: '', schedule: false, scheduleDate: '' };
    this.assets.update(list => list.map(a => ({ ...a, selected: false })));
  }
}