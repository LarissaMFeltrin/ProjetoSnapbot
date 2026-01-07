import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const passwordConfirmation = control.get('password_confirmation');

        if (!password || !passwordConfirmation) {
            return null;
        }

        return password.value === passwordConfirmation.value ? null : { passwordMismatch: true };
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.loading = true;
            const formValue = this.registerForm.value;

            this.authService.register(
                formValue.name,
                formValue.email,
                formValue.password,
                formValue.password_confirmation
            ).subscribe({
                next: () => {
                    this.snackBar.open('Registro realizado com sucesso!', 'Fechar', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
                    this.router.navigate(['/devices']);
                },
                error: (error) => {
                    this.loading = false;
                    // O erro já é tratado pelo ErrorInterceptor
                },
                complete: () => {
                    this.loading = false;
                }
            });
        }
    }
}

