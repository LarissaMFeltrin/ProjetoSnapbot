import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private authService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Ocorreu um erro';

                if (error.error instanceof ErrorEvent) {
                    // Erro do lado do cliente
                    errorMessage = `Erro: ${error.error.message}`;
                } else {
                    // Erro do lado do servidor
                    switch (error.status) {
                        case 401:
                            errorMessage = 'Não autorizado. Faça login novamente.';
                            this.authService.logout();
                            break;
                        case 403:
                            errorMessage = 'Acesso negado.';
                            break;
                        case 404:
                            errorMessage = 'Recurso não encontrado.';
                            break;
                        case 422:
                            // Erro de validação
                            const validationErrors = error.error.errors || error.error.message;
                            if (typeof validationErrors === 'object') {
                                const messages = Object.values(validationErrors).flat();
                                errorMessage = messages.join(', ');
                            } else {
                                errorMessage = validationErrors || 'Dados inválidos.';
                            }
                            break;
                        case 500:
                            errorMessage = 'Erro interno do servidor.';
                            break;
                        default:
                            errorMessage = error.error?.message || `Erro ${error.status}: ${error.statusText}`;
                    }
                }

                this.snackBar.open(errorMessage, 'Fechar', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });

                return throwError(() => error);
            })
        );
    }
}

