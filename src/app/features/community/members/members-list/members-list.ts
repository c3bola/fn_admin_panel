import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
    LucideAngularModule, Menu, Search, ChevronDown, Users, Star,
    Shield, Ban, AlertTriangle, CheckCircle, Mail, MoreVertical,
    Calendar, Download, UserPlus, Filter, Bot, MessageSquare, Clock, FileText,
} from 'lucide-angular';

// Nova interface para os registros
interface Registration {
    name: string;
    type: 'group' | 'bot' | 'channel';
}

interface Member {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: 'Admin' | 'VIP' | 'Membro';
    status: 'Online' | 'Offline' | 'Banido';
    warns: number;
    joinDate: string;
    registrations: Registration[]; // <-- Nova propriedade
}

@Component({
    selector: 'app-members-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, RouterLink],
    templateUrl: './members-list.html'
})
export class MembersListComponent {
    readonly Menu = Menu; readonly Search = Search; readonly ChevronDown = ChevronDown;
    readonly Users = Users; readonly Star = Star; readonly Shield = Shield;
    readonly Ban = Ban; readonly AlertTriangle = AlertTriangle; readonly CheckCircle = CheckCircle;
    readonly Mail = Mail; readonly MoreVertical = MoreVertical; readonly Calendar = Calendar;
    readonly Download = Download; readonly UserPlus = UserPlus; readonly Filter = Filter;
    readonly Bot = Bot; readonly MessageSquare = MessageSquare; // <-- Novos ícones
    readonly Clock = Clock; readonly FileText = FileText;
    
    stats = {
        total: '12.458',
        online: '1.240',
        vip: '342',
        banned: '156'
    };

    // Controle de qual menu de linha está aberto
    openMenuId = signal<string | null>(null);

    toggleMenu(id: string) {
        this.openMenuId.update(current => current === id ? null : id);
    }
    // Mock atualizado com os registros
    members = signal<Member[]>([
        {
            id: '1029384756', name: 'C3bola', username: '@C3bola',
            avatar: 'https://ui-avatars.com/api/?name=C3bola&background=7c3aed&color=fff',
            role: 'Admin', status: 'Online', warns: 0, joinDate: '12/02/2024',
            registrations: [
                { name: 'Fortnite Salve o Mundo', type: 'group' },
                { name: 'FortMeBot', type: 'bot' },
                { name: 'LojaFortniteBot', type: 'bot' }
            ]
        },
        {
            id: '9876543210', name: 'Jogador Pro', username: '@Jogador_Pro_BR',
            avatar: 'https://ui-avatars.com/api/?name=Jogador+Pro&background=f59e0b&color=fff',
            role: 'VIP', status: 'Offline', warns: 1, joinDate: '15/03/2024',
            registrations: [
                { name: 'Fortnite Brasil (Oficial)', type: 'group' },
                { name: 'Clubinho VIP', type: 'channel' },
                { name: 'BattleBusBot', type: 'bot' }
            ]
        },
        {
            id: '1122334455', name: 'Ninja BR', username: '@NinjaBR',
            avatar: 'https://ui-avatars.com/api/?name=Ninja+BR&background=3b82f6&color=fff',
            role: 'Membro', status: 'Online', warns: 0, joinDate: '20/05/2024',
            registrations: [
                { name: 'Fortnite Brasil (Oficial)', type: 'group' },
                { name: 'GuardaOiBot', type: 'bot' }
            ]
        },
        {
            id: '9988776655', name: 'Toxic Player', username: '@ToxicPlayer',
            avatar: 'https://ui-avatars.com/api/?name=Toxic+Player&background=ef4444&color=fff',
            role: 'Membro', status: 'Banido', warns: 3, joinDate: '01/01/2024',
            registrations: [
                { name: 'Fortnite Salve o Mundo', type: 'group' }
            ]
        }
    ]);
}