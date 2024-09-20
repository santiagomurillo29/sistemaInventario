import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Cliente } from '../../../../Interfaces/cliente';
import { ClienteService } from '../../../../Services/cliente.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-modal-cliente',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css']
})
export class ModalClienteComponent implements OnInit{

  formularioCliente: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCLiente: Cliente,
    private fb: FormBuilder,
    private _clienteService: ClienteService,
    private _utilidadServicio: UtilidadService
  ){
    // llenamos los campos del formulario
    this.formularioCliente = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required]
    })

    // si los campos en el formulario es diferente a nulo (es decir que si tienen info)
    if (this.datosCLiente != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar"
    }
  }
  

  ngOnInit(): void {
    if(this.datosCLiente != null){
      this.formularioCliente.patchValue({
        nombre: this.datosCLiente.nombre,
        documento: this.datosCLiente.documento,
        telefono: this.datosCLiente.telefono,
        correo: this.datosCLiente.correo,
        numeroCompras: this.datosCLiente.numeroCompras
      })
    }
  }

  guardarEditar_Cliente(){
    const _cliente:Cliente = {
      idCliente: this.datosCLiente == null ? 0 : this.datosCLiente.idCliente,
      nombre : this.formularioCliente.value.nombre,
      documento : this.formularioCliente.value.documento,
      telefono : this.formularioCliente.value.telefono,
      correo : this.formularioCliente.value.correo,
      numeroCompras: this.formularioCliente.value.numeroCompras,
    }

    // si estan vacios es porque cuando le dan en agregar estan vacios por ende apenas va a guardar
    if(this.datosCLiente == null){
      this._clienteService.guardar(_cliente).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El cliente fue registrado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registar el cliente", "Error")
          }
        },
        error:(e) => {}
      })
    }
    else{
      this._clienteService.editar(_cliente).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El cliente fue editado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el cliente", "Error")
          }
        },
        error:(e) => {}
      })
    }
  }
}
