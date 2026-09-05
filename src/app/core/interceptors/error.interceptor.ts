import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Ocorreu um erro desconhecido.';

      if (error.error instanceof ErrorEvent) {
        // Falhas locais (rede offline, erro de execução no navegador)
        errorMsg = `Erro do cliente: ${error.error.message}`;
      } else {
        // O Node (Gateway) deve sempre retornar um JSON com a propriedade "message" ou "error"
        const serverMessage = error.error?.message || error.error?.error || error.message;
        errorMsg = `[Node Gateway] ${error.status}: ${serverMessage}`;
        
        switch (error.status) {
          case 401:
            console.warn('Sessão expirada. Redirecionando para login...');
            localStorage.removeItem('admin_token');
            router.navigate(['/login']);
            break;
          case 403:
            console.warn('Acesso negado. Você não tem permissão para esta ação.');
            break;
          case 500:
            console.error('Falha interna no backend (Node ou serviço subjacente).');
            break;
        }
      }

      console.error(errorMsg);
      return throwError(() => error);
    })
  );
};