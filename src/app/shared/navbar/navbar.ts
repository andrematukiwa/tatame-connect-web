import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly title = input('Tatame Connect');
  readonly subtitle = input<string | null>(null);
  readonly profileLink = input<string | null>(null);
  readonly profileLabel = input('Meu perfil');

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
