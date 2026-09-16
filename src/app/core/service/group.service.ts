import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GroupSummary {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  onlineCount: number;
  isOfficial: boolean;
  isVip: boolean;
  botActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/groups`;

  getGroups(): Observable<GroupSummary[]> {
    return this.http.get<GroupSummary[]>(this.apiUrl);
  }
  createGroup(data: { name: string; isOfficial: boolean }): Observable<GroupSummary> {
    return this.http.post<GroupSummary>(this.apiUrl, data);
  }
}