import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    const user_type = 'Estudiante';

    this.auth.register(this.name, this.email, this.password, user_type).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response); // <-- agrega esto
        this.successMessage = '¡Registro exitoso! Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },

      error: (err) => {
        console.error('Error al registrar:', err);
        if (err.status === 409) {
          this.errorMessage = 'Este correo ya está registrado.';
        } else {
          this.errorMessage = 'No se pudo registrar. Intenta de nuevo.';
        }
      }
    });

  }
}
