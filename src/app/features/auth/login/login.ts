import { Component, ElementRef, ViewChild, AfterViewInit, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Zap, Send, Lock, ShieldCheck } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements AfterViewInit {
  // Captura a div âncora que criamos no HTML
  @ViewChild('telegramWidgetContainer', { static: true }) telegramWidgetContainer!: ElementRef;
  
  private router = inject(Router);
  private http = inject(HttpClient); // Para chamadas na nossa API
  private ngZone = inject(NgZone);   // Para devolver o callback do window para o Angular

  readonly Zap = Zap;
  readonly Lock = Lock;
  readonly ShieldCheck = ShieldCheck;
  readonly Send = Send;

  ngAfterViewInit() {
    // 1. Cria o callback global que o Telegram vai chamar após o usuário aceitar
    (window as any).onTelegramAuth = (user: any) => {
      // O NgZone garante que o Angular perceba a mudança feita por um script externo
      this.ngZone.run(() => {
        this.sincronizarComBackend(user);
      });
    };

    // 2. Constrói o script dinamicamente
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    // ATENÇÃO: Substitua pelo username do seu bot sem o @
    script.setAttribute('data-telegram-login', 'guardaoibot'); 
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    
    // 3. Injeta na tela
    this.telegramWidgetContainer.nativeElement.appendChild(script);
  }

  // Envia o payload do Telegram para a rota que criamos no Node.js
  private sincronizarComBackend(telegramUser: any) {
    this.http.post('http://localhost:3000/api/v1/auth/telegram', telegramUser)
      .subscribe({
        next: (response: any) => {
          // Armazena o JWT devolvido pelo Node.js
          localStorage.setItem('admin_token', response.token);
          // Redireciona para o painel
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Falha de segurança ou ID não autorizado:', error);
          // Aqui você pode disparar um toast/alerta de erro na UI
        }
      });
  }
  loginMockado() {
  this.http.post('http://localhost:3000/api/v1/auth/mock', {})
    .subscribe({
      next: (response: any) => {
        // Armazena o token e os dados mockados da sessão
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_user', JSON.stringify(response.user));
        
        // Redireciona direto para a área logada
        this.router.navigate(['/admin']);
      },
      error: (err) => console.error('Erro ao gerar mock de sessão:', err)
    });
}
}