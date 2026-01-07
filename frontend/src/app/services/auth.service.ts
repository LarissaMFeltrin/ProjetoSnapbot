import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
    id: number;
    name: string;
    email: string;
    created_at?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private tokenKey = 'auth_token';
    private userKey = 'auth_user';

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
            .pipe(
                tap(response => {
                    this.setToken(response.token);
                    this.setUser(response.user);
                    this.isAuthenticatedSubject.next(true);
                    this.currentUserSubject.next(response.user);
                })
            );
    }

    register(name: string, email: string, password: string, password_confirmation: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/register`, {
            name,
            email,
            password,
            password_confirmation
        }).pipe(
            tap(response => {
                this.setToken(response.token);
                this.setUser(response.user);
                this.isAuthenticatedSubject.next(true);
                this.currentUserSubject.next(response.user);
            })
        );
    }

    logout(): void {
        this.removeToken();
        this.removeUser();
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getUser(): User | null {
        return this.getStoredUser();
    }

    private setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    private setUser(user: User): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    private removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    private removeUser(): void {
        localStorage.removeItem(this.userKey);
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }

    private getStoredUser(): User | null {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }
}

