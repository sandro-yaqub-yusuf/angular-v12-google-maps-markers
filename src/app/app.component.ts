import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(
    private router: Router,
    private location: Location
  ) { }

  onPerfilChange(id: string): void {
    const atual = this.location.path();
    const destino = ((!atual) ? `/portal-servicos/portal-os` : atual);

    this.router.navigateByUrl(destino, { skipLocationChange: true });
  }

  rolesDoPerfil(roles: string[]): string {
    return (roles.length ? roles.join(', ') : 'nenhuma role');
  }
}
