import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, Menu, Search, Gift, Calendar, DollarSign, 
  Users, Trophy, Plus, X, Image as ImageIcon, Send, Crown, CheckCircle
} from 'lucide-angular';

interface Participant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isWinner?: boolean;
}

interface Giveaway {
  id: string;
  title: string;
  date: string;
  type: string;
  value: string;
  description: string;
  winnersCount: number;
  image: string;
  status: 'Ativo' | 'Finalizado';
  participants: Participant[];
}

@Component({
  selector: 'app-giveaways-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './giveaways-list.html'
})
export class GiveawaysListComponent {
  readonly Menu = Menu; readonly Search = Search; readonly Gift = Gift; 
  readonly Calendar = Calendar; readonly DollarSign = DollarSign; readonly Users = Users; 
  readonly Trophy = Trophy; readonly Plus = Plus; readonly X = X; 
  readonly ImageIcon = ImageIcon; readonly Send = Send; readonly Crown = Crown;
  readonly CheckCircle = CheckCircle;

  activeTab = signal<'ativos' | 'historico'>('ativos');

  // Mocks de Participantes
  mockParticipants: Participant[] = [
    { id: '1', name: 'Anezio Fidalgo', username: '@C3bola', avatar: 'https://ui-avatars.com/api/?name=Anezio+Fidalgo&background=7c3aed&color=fff' },
    { id: '2', name: 'Jogador Pro', username: '@Jogador_Pro_BR', avatar: 'https://ui-avatars.com/api/?name=Jogador+Pro&background=f59e0b&color=fff' },
    { id: '3', name: 'Ninja BR', username: '@NinjaBR', avatar: 'https://ui-avatars.com/api/?name=Ninja+BR&background=3b82f6&color=fff', isWinner: true },
    { id: '4', name: 'Darkness', username: '@Darkness', avatar: 'https://ui-avatars.com/api/?name=Darkness&background=ec4899&color=fff' }
  ];

  // Mocks de Sorteios
  giveaways = signal<Giveaway[]>([
    {
      id: 'g1',
      title: 'Clube Fortnite Setembro',
      date: '08/09/2026',
      type: 'Mensal',
      value: 'R$ 38,00',
      description: 'Clube Fortnite de Setembro!\n· Traje Exclusivo\n· Mochila Temática\n· 800 V-Bucks\n· Rocket Pass Premium',
      winnersCount: 1,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400&h=200',
      status: 'Ativo',
      participants: [this.mockParticipants[0], this.mockParticipants[1]]
    },
    {
      id: 'g2',
      title: 'Clube Fortnite Julho',
      date: '08/07/2026',
      type: 'Mensal',
      value: 'R$ 38,00',
      description: 'Clube Fortnite de julho !\n· Traje Paola Coelho\n· Mochila Parceiro Tecnocoelho\n· Picareta Lâmina Karitt\n· Passe C7:T3, OG/Raiz, Musical e LEGO\n· 800 V-Bucks\n· Rocket Pass Premium',
      winnersCount: 1,
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=400&h=200',
      status: 'Finalizado',
      participants: this.mockParticipants
    }
  ]);

  // Controles de Modal
  isCreateModalOpen = signal(false);
  selectedGiveaway = signal<Giveaway | null>(null);

  // Formulário de Novo Sorteio
  newGiveaway = {
    title: '', date: '', type: 'Mensal', value: '', description: '', winnersCount: 1, image: ''
  };

  get filteredGiveaways() {
    const status = this.activeTab() === 'ativos' ? 'Ativo' : 'Finalizado';
    return this.giveaways().filter(g => g.status === status);
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
    this.newGiveaway = { title: '', date: '', type: 'Mensal', value: '', description: '', winnersCount: 1, image: '' };
  }

  viewDetails(giveaway: Giveaway) {
    this.selectedGiveaway.set(giveaway);
  }

  closeDetails() {
    this.selectedGiveaway.set(null);
  }

  triggerDraw(giveaway: Giveaway) {
    if(confirm(`Tem certeza que deseja sortear ${giveaway.winnersCount} ganhador(es) agora?`)) {
      alert('Sorteio realizado! O bot anunciará o vencedor no grupo.');
      // Lógica futura de integração com o Node.js para rodar o sorteio
      this.closeDetails();
    }
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => this.newGiveaway.image = e.target?.result as string;
      reader.readAsDataURL(input.files[0]);
    }
  }

  saveGiveaway() {
    console.log('Criando Sorteio...', this.newGiveaway);
    this.closeCreateModal();
  }
}