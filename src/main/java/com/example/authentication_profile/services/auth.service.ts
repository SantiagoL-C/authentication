import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';

export interface User {
  id: number;
  correo: string;
  user_type: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/login';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  login(correo: string, contrasena: string): Observable<User> {
    return this.http.post<User>(this.apiUrl, { correo, contrasena }).pipe(
      tap(user => {
        this.currentUser = user;
        localStorage.setItem('token', user.token);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('token');
  }
  register(nombre: string, correo: string, contrasena: string, user_type: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/register', {
      nombre,
      correo,
      contrasena,
      user_type
    });
  }
}
