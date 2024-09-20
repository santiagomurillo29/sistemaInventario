import { Component, OnInit, Inject } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Proveedor } from '../../../../Interfaces/proveedor';
import { ProveedorService } from '../../../../Services/proveedor.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';


@Component({
  selector: 'app-modal-proveedor',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.css']
})
export class ModalProveedorComponent implements OnInit{

  formularioProveedor: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProveedor: Proveedor,
    private fb: FormBuilder,
    private _proveedorService: ProveedorService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioProveedor = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      estado: ['1', Validators.required]
    });

    if (this.datosProveedor != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar"
    }
  }

  ngOnInit(): void {
    if(this.datosProveedor != null){
      // en caso de axtualizar
      this.formularioProveedor.patchValue({
      nombre: this.datosProveedor.nombre,
      documento: this.datosProveedor.documento,
      telefono: this.datosProveedor.telefono,
      correo: this.datosProveedor.correo,
      estado: this.datosProveedor.estado.toString(),
      })
    }  
  }

  guardarEditar_Proveedor(){
    const _proveedor:Proveedor = {
      idProveedor: this.datosProveedor == null ? 0 : this.datosProveedor.idProveedor,
      nombre : this.formularioProveedor.value.nombre,
      documento : this.formularioProveedor.value.documento,
      telefono : this.formularioProveedor.value.telefono,
      correo : this.formularioProveedor.value.correo,
      estado : parseInt(this.formularioProveedor.value.estado),
    }

    // si estan vacios es porque cuando le dan en agregar estan vacios por ende apenas va a guardar
    if(this.datosProveedor == null){
      this._proveedorService.guardar(_proveedor).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El proveedor fue registrado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registar el proveedor", "Error")
          }
        },
        error:(e) => {}
      })
    }
    else{
      this._proveedorService.editar(_proveedor).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El proveedor fue editado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el proveedor", "Error")
          }
        },
        error:(e) => {}
      })
    }
  }



}
