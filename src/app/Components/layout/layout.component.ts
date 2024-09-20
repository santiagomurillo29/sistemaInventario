import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Menu } from '../../Interfaces/menu';
import { MenuService } from '../../Services/menu.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';

import { SharedModule } from '../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  listaMenus: Menu[] = [];
  correoUsuario: string = "";
  rolUsuario: string ="";

  constructor(
    private router:Router,
    private _menuServicio: MenuService,
    private _utilidadServicio: UtilidadService
  ){}


  ngOnInit(): void {
    // obtener info del usuario
    const usuario = this._utilidadServicio.obtenerSessionUsuario();

    if(usuario != null){
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;
      
      // ejecutar menu servicio para obtener menus servicio
      this._menuServicio.lista(usuario.idUsuario).subscribe({
        next: (data) =>{
          if(data.status){
            this.listaMenus = data.value;
          }
        },
        error:(e) => {}
      })
    }
  }


  cerrarSesion(){
    this._utilidadServicio.eliminarSessionUsuario();
    localStorage.removeItem('token')
    // regresa al login
    this.router.navigate(['login'])
  }
}


