import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, Menu, Search, ChevronDown, Star, Crown, 
  Check, X, Edit2, Save, Filter, Calendar, Gift, Tag, Gauge, 
  Unlock, CheckSquare, Megaphone
} from 'lucide-angular';

export interface VipBenefits {
  acoesPromocionais: boolean;
  tagCustomizada: boolean;
  bypassSlowMode: boolean;
  falarGrupoFechado: boolean;
  opinarDecisoes: boolean;
}

export interface VipMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  plan: 'R$ 3,00' | 'R$ 4,00' | 'R$ 5,00';
  divulgacoesDiarias: number;
  status: 'Ativo' | 'Expirando' | 'Inativo';
  expiresAt: string;
  benefits: VipBenefits;
}

@Component({
  selector: 'app-vip-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './vip-list.html'
})
export class VipListComponent {
  readonly Menu = Menu; readonly Search = Search; readonly ChevronDown = ChevronDown;
  readonly Star = Star; readonly Crown = Crown; readonly Check = Check; 
  readonly X = X; readonly Edit2 = Edit2; readonly Save = Save; 
  readonly Filter = Filter; readonly Calendar = Calendar; readonly Gift = Gift; 
  readonly Tag = Tag; readonly Gauge = Gauge; readonly Unlock = Unlock; 
  readonly CheckSquare = CheckSquare; readonly Megaphone = Megaphone;

  stats = {
    total: '124',
    active: '112',
    expiring: '12',
    revenue: 'R$ 425,00'
  };

  vips = signal<VipMember[]>([
    {
      id: '9876543210', name: 'Jogador Pro', username: '@Jogador_Pro_BR',
      avatar: 'https://ui-avatars.com/api/?name=Jogador+Pro&background=f59e0b&color=fff',
      plan: 'R$ 5,00', divulgacoesDiarias: 4, status: 'Ativo', expiresAt: '15/09/2026',
      benefits: { acoesPromocionais: true, tagCustomizada: true, bypassSlowMode: true, falarGrupoFechado: true, opinarDecisoes: true }
    },
    {
      id: '4455667788', name: 'Darkness', username: '@Darkness',
      avatar: 'https://ui-avatars.com/api/?name=Darkness&background=ec4899&color=fff',
      plan: 'R$ 3,00', divulgacoesDiarias: 2, status: 'Expirando', expiresAt: '05/09/2026',
      benefits: { acoesPromocionais: true, tagCustomizada: true, bypassSlowMode: true, falarGrupoFechado: false, opinarDecisoes: false }
    },
    {
      id: '1122334455', name: 'Ninja BR', username: '@NinjaBR',
      avatar: 'https://ui-avatars.com/api/?name=Ninja+BR&background=3b82f6&color=fff',
      plan: 'R$ 4,00', divulgacoesDiarias: 3, status: 'Ativo', expiresAt: '20/10/2026',
      benefits: { acoesPromocionais: true, tagCustomizada: true, bypassSlowMode: true, falarGrupoFechado: true, opinarDecisoes: true }
    }
  ]);

  editingMember = signal<VipMember | null>(null);

  openEditBenefits(member: VipMember) {
    this.editingMember.set(JSON.parse(JSON.stringify(member)));
  }

  closeEditBenefits() {
    this.editingMember.set(null);
  }

  // Atualiza automaticamente as divulgações diárias baseadas no plano escolhido no Modal
  onPlanChange(newPlan: 'R$ 3,00' | 'R$ 4,00' | 'R$ 5,00') {
    const member = this.editingMember();
    if (!member) return;
    
    if (newPlan === 'R$ 3,00') member.divulgacoesDiarias = 2;
    else if (newPlan === 'R$ 4,00') member.divulgacoesDiarias = 3;
    else if (newPlan === 'R$ 5,00') member.divulgacoesDiarias = 4;
  }

  saveBenefits() {
    const updated = this.editingMember();
    if (updated) {
      this.vips.update(list => list.map(m => m.id === updated.id ? updated : m));
      this.closeEditBenefits();
    }
  }
}