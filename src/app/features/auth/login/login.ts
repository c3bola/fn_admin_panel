import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Zap, Send, Lock, ShieldCheck } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './login.html',
  // O Angular 22 pode ter gerado styleUrl no singular, mantenha como foi gerado no seu arquivo
  styleUrl: './login.scss' 
})
export class LoginComponent {
  // Injeção do roteador do Angular
  private router = inject(Router);

  readonly Zap = Zap;
  readonly Send = Send;
  readonly Lock = Lock;
  readonly ShieldCheck = ShieldCheck;

  // Função disparada ao clicar no botão
  entrarNoPainel() {
    // Redireciona o usuário para a rota do dashboard
    this.router.navigate(['/admin']);
  }
}