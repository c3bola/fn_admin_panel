import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/global-layout/global-layout').then(c => c.GlobalLayoutComponent),
    children: [
      {
        path: '', 
        loadComponent: () => import('./features/global-dashboard/global-dashboard').then(c => c.GlobalDashboardComponent)
      },
      // Rotas de Comunidade
      {
        path: 'groups',
        loadComponent: () => import('./features/community/groups/groups-list/groups-list').then(c => c.GroupsListComponent)
      },
      {
        path: 'groups/:groupId',
        loadComponent: () => import('./features/community/groups/group-details/group-details').then(c => c.GroupDetailsComponent)
      },
      {
        path: 'members',
        loadComponent: () => import('./features/community/members/members-list/members-list').then(c => c.MembersListComponent)
      },
      {
        path: 'members/:id',
        loadComponent: () => import('./features/community/members/member-details/member-details').then(c => c.MemberDetailsComponent)
      },
      {
        path: 'vip',
        loadComponent: () => import('./features/community/vip/vip-list/vip-list').then(c => c.VipListComponent)
      },
      {
        path: 'announcements',
        loadComponent: () => import('./features/community/announcements/announcements-list/announcements-list').then(c => c.AnnouncementsListComponent)
      },
      {
        path: 'giveaways',
        loadComponent: () => import('./features/community/giveaways/giveaways-list/giveaways-list').then(c => c.GiveawaysListComponent)
      },
    ]
  },
  {
    path: 'admin/bots/:botId',
    loadComponent: () => import('./layout/bot-layout/bot-layout').then(c => c.BotLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/bot-dashboard/bot-dashboard').then(c => c.BotDashboardComponent)
      }
    ]
  },
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  }
];