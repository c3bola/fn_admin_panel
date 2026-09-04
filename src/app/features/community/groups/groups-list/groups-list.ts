import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { 
  LucideAngularModule, Menu, Search, ChevronDown, LayoutGrid, List as ListIcon, 
  Users, Star, Megaphone, Gift, ShieldAlert, Bus, Bot, ShoppingCart, 
  Plus, ArrowRight, Shield, Info, UserPlus
} from 'lucide-angular';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './groups-list.html'
})
export class GroupsListComponent {
  readonly Menu = Menu;
  readonly Search = Search;
  readonly ChevronDown = ChevronDown;
  readonly LayoutGrid = LayoutGrid;
  readonly ListIcon = ListIcon;
  readonly Users = Users;
  readonly Star = Star;
  readonly Megaphone = Megaphone;
  readonly Gift = Gift;
  readonly ShieldAlert = ShieldAlert;
  readonly Bus = Bus;
  readonly Bot = Bot;
  readonly ShoppingCart = ShoppingCart;
  readonly Plus = Plus;
  readonly ArrowRight = ArrowRight;
  readonly Shield = Shield;
  readonly Info = Info;
  readonly UserPlus = UserPlus;

  // Dados mockados baseados na imagem
  communityGroups = [
    { name: 'Fortnite Brasil', desc: 'Grupo oficial da comunidade Fortnite Brasil. Participe de eventos, novidades e muito mais!', online: 124, members: 512, icon: this.Users, badge: 'PRINCIPAL', badgeColor: 'bg-purple-600', link: '/admin/groups/fortnite-brasil' },
    { name: 'Clubinho Fortnite', desc: 'Grupo exclusivo para membros VIP. Conteúdos e benefícios exclusivos!', online: 82, members: 152, icon: this.Star, badge: '', isVip: true, link: '#' },
    { name: 'Avisos Fortnite Brasil', desc: 'Fique por dentro de todos os avisos importantes da comunidade.', online: 512, members: 512, icon: this.Megaphone, badge: '', link: '#' },
    { name: 'Sorteios e Eventos', desc: 'Participe de sorteios e eventos exclusivos da comunidade.', online: 18, members: 215, icon: this.Gift, badge: '', link: '#' }
  ];

  thirdPartyGroups = [
    { name: 'Zona de Competições', desc: 'Grupo focado em competições e scrims de Fortnite.', online: 41, members: 328, bot: 'GuardaOiBot', botIcon: this.ShieldAlert, link: '#' },
    { name: 'Battle Royale BR', desc: 'Grupo para encontrar squad e jogar Battle Royale.', online: 37, members: 215, bot: 'BattleBusBot', botIcon: this.Bus, link: '#' },
    { name: 'Clã dos Construtores', desc: 'Dicas, construções e estratégias para melhorar no Fortnite.', online: 29, members: 189, bot: 'FortMeBot', botIcon: this.Bot, link: '#' },
    { name: 'Trocas e Vendas BR', desc: 'Compre, venda e troque contas, skins e itens.', online: 14, members: 146, bot: 'LojaFortniteBot', botIcon: this.ShoppingCart, link: '#' }
  ];
}