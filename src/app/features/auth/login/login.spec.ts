import { Component, ElementRef, ViewChild, AfterViewInit, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Zap, Send, Lock, ShieldCheck } from 'lucide-angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('telegramWidgetContainer') telegramWidgetContainer?: ElementRef;
  
  private router = inject(Router);
  private http = inject(HttpClient);
  private ngZone = inject(NgZone);

  readonly Zap = Zap;
  readonly Lock = Lock;
  readonly ShieldCheck = ShieldCheck;
  readonly Send = Send;

  ngAfterViewInit() {
    (window as any).onTelegramAuth = (user: any) => {
      this.ngZone.run(() => {
        this.sincronizarComBackend(user);
      });
    };

    if (this.telegramWidgetContainer?.nativeElement) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'guardaoibot'); 
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      
      this.telegramWidgetContainer.nativeElement.appendChild(script);
    }
  }

  private sincronizarComBackend(telegramUser: any) {
    this.http.post(`${environment.apiUrl}/auth/telegram`, telegramUser)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('admin_token', response.token);
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Falha de segurança ou ID não autorizado:', error);
        }
      });
  }

  loginMockado() {
    this.http.post(`${environment.apiUrl}/auth/mock`, {})
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('admin_token', response.token);
          localStorage.setItem('admin_user', JSON.stringify(response.user));
          this.router.navigate(['/admin']);
        },
        error: (err) => console.error('Erro ao gerar mock de sessão:', err)
      });
  }
}