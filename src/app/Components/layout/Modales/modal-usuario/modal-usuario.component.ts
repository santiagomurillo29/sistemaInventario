import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// traer
import { Rol } from '../../../../Interfaces/rol';
import { RolService } from '../../../../Services/rol.service';

// original
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';


import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css'
})

export class ModalUsuarioComponent implements OnInit{

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaRoles: Rol[] = []

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioUsuario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
      estado: ['1', Validators.required],
      idRol: ['', Validators.required]
    });

    if (this.datosUsuario != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar"
    }

    this._rolServicio.lista().subscribe({
      next: (data) => {
        if(data.status){
          this.listaRoles = data.value
        }
      }, 
      error:(e) => {}
    })
  }

  // se ejecuta cuando el componente ya se este iniciando
  ngOnInit(): void{
    if(this.datosUsuario != null){
      this.formularioUsuario.patchValue({
      nombre: this.datosUsuario.nombre,
      apellido: this.datosUsuario.apellido,
      documento: this.datosUsuario.documento,
      telefono: this.datosUsuario.telefono,
      correo: this.datosUsuario.correo,
      usuario: this.datosUsuario.usuario,
      contrasena: this.datosUsuario.contrasena,
      estado: this.datosUsuario.estado.toString(),
      idRol: this.datosUsuario.idRol
      })
    }
  }


  guardarEditar_Usuario(){
    const _usuario:Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombre : this.formularioUsuario.value.nombre,
      apellido : this.formularioUsuario.value.apellido,
      documento : this.formularioUsuario.value.documento,
      telefono : this.formularioUsuario.value.telefono,
      correo : this.formularioUsuario.value.correo,
      usuario : this.formularioUsuario.value.usuario,
      contrasena : this.formularioUsuario.value.contrasena,
      estado : parseInt(this.formularioUsuario.value.estado),
      idRol : this.formularioUsuario.value.idRol,
      rolDescripcion : "",
    }

    if(this.datosUsuario == null){
      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue registrado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registar el usuario", "Error")
          }
        },
        error:(e) => {}
      })
    }
    else{
      this._usuarioServicio.editar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue editado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario", "Error")
          }
        },
        error:(e) => {}
      })
    }
  }
}
