import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, LoginResponse, User } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: router }]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve iniciar como não autenticado quando não existe token', (done) => {
    service.isAuthenticated$.subscribe((isAuth) => {
      expect(isAuth).toBeFalse();
      done();
    });
  });

  it('login deve chamar /login e salvar token/usuário no localStorage', () => {
    const mockUser: User = { id: 1, name: 'Test', email: 'test@example.com' };
    const mockResponse: LoginResponse = { token: 'abc123', user: mockUser };

    service.login('test@example.com', 'password123').subscribe((res) => {
      expect(res.token).toBe('abc123');
      expect(localStorage.getItem('auth_token')).toBe('abc123');
      expect(localStorage.getItem('auth_user')).toContain('test@example.com');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
    req.flush(mockResponse);
  });

  it('logout deve remover token/usuário e redirecionar para /login', () => {
    localStorage.setItem('auth_token', 'abc123');
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Test', email: 'test@example.com' }));

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});


