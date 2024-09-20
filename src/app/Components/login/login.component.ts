import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../Interfaces/login';
import { UsuarioService } from '../../Services/usuario.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { SharedModule } from '../../Reutilizable/shared/shared.module';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  formularioLogin: FormGroup;
  ocultarPassword:Boolean = true;
  mostrarLoading:Boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioLogin = this.fb.group({
      user:['', Validators.required],
      password:['', Validators.required]
    });
  }

  iniciarSesion(){
    this.mostrarLoading = true;

    const request: Login = {
      usuario: this.formularioLogin.value.user,
      contrasena: this.formularioLogin.value.password
    }

    this._usuarioServicio.iniciarSesion(request).subscribe({
      next: (data) =>{
        if(data.status){
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"])
        } else{
          this._utilidadServicio.mostrarAlerta("No se encontraron coincidencias", "Opps")
        }
      },

      // siempre se ejecuta cuando se completa una solicitud
      complete: () =>{
        this.mostrarLoading = false;
      },

      error: () =>{
        this._utilidadServicio.mostrarAlerta("Hubo un error", "Opps")
      }

    })
   }

}
