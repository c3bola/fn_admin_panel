import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, ArrowLeft, Users, Star, Shield, Ban, AlertTriangle, 
  CheckCircle, Bot, MessageSquare, Terminal, Clock, FileText, Save, Plus, 
  MoreVertical, Trash2
} from 'lucide-angular';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, FormsModule],
  templateUrl: './member-details.html'
})
export class MemberDetailsComponent {
  readonly ArrowLeft = ArrowLeft; readonly Users = Users; readonly Star = Star; 
  readonly Shield = Shield; readonly Ban = Ban; readonly AlertTriangle = AlertTriangle; 
  readonly CheckCircle = CheckCircle; readonly Bot = Bot; readonly MessageSquare = MessageSquare; 
  readonly Terminal = Terminal; readonly Clock = Clock; readonly FileText = FileText; 
  readonly Save = Save; readonly Plus = Plus; readonly MoreVertical = MoreVertical; 
  readonly Trash2 = Trash2;

  // Mock do Usuário
  member = {
    id: '9876543210',
    name: 'Jogador Pro',
    username: '@Jogador_Pro_BR',
    avatar: 'https://ui-avatars.com/api/?name=Jogador+Pro&background=f59e0b&color=fff',
    role: 'VIP',
    status: 'Online',
    warns: 1,
    joinDate: '15/03/2024'
  };

  // Mock da Timeline (Histórico)
  timeline = [
    { type: 'warn', title: 'Recebeu um Warn (Anti-Spam)', desc: 'Silenciado por 1 hora. Aplicado por Sistema (Auto).', date: 'Hoje, 11:15', icon: this.AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
    { type: 'command', title: 'Usou comando /reportar', desc: 'Denunciou uma mensagem no grupo "Fortnite Brasil".', date: 'Ontem, 20:30', icon: this.Terminal, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    { type: 'bot', title: 'Iniciou o FortMeBot', desc: 'Interagiu com o bot no privado pela primeira vez.', date: '16/03/2024, 14:00', icon: this.Bot, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    { type: 'group', title: 'Entrou no grupo Fortnite Brasil', desc: 'Adicionado via link de convite.', date: '15/03/2024, 09:45', icon: this.Users, color: 'text-purple-400', bg: 'bg-purple-600/20', border: 'border-purple-500/30' }
  ];

  // Observações (Notas da Staff)
  newNote = signal('');
  notes = signal([
    { author: '@C3bola', date: '20/05/2024', text: 'Usuário alertado no PV sobre flood. Se repetir, aplicar ban temporário.' }
  ]);

  addNote() {
    if (this.newNote().trim()) {
      this.notes.update(curr => [{ author: '@Admin', date: 'Agora', text: this.newNote() }, ...curr]);
      this.newNote.set('');
    }
  }
}