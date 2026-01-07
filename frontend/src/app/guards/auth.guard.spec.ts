import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: router },
        {
          provide: AuthService,
          useValue: { isAuthenticated$: of(false) }
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('deve negar acesso e navegar para /login quando não autenticado', (done) => {
    guard.canActivate().subscribe((can) => {
      expect(can).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});


