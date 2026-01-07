import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['register']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve marcar erro quando senha e confirmação não batem', () => {
    component.registerForm.patchValue({
      name: 'Teste',
      email: 'test@test.com',
      password: 'password123',
      password_confirmation: 'diferente'
    });

    expect(component.registerForm.errors).toEqual({ passwordMismatch: true });
  });

  it('onSubmit deve chamar register e navegar em sucesso', () => {
    authService.register.and.returnValue(of({ token: 't', user: { id: 1, name: 'A', email: 'a@a.com' } }));

    component.registerForm.patchValue({
      name: 'Teste',
      email: 'test@test.com',
      password: 'password123',
      password_confirmation: 'password123'
    });

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith('Teste', 'test@test.com', 'password123', 'password123');
    expect(snackBar.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/devices']);
  });
});


