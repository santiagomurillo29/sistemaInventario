import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit{

  formularioProducto: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioProducto = this.fb.group({
      codigoBarras: ['', Validators.required],
      nombre: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio: ['', Validators.required],
      estado: ['1', Validators.required],
    });

    if (this.datosProducto != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar"
    }
  }

  // en caso de que los datos de productos tenga informacion
  ngOnInit(): void{
    if(this.datosProducto != null){
      this.formularioProducto.patchValue({
      codigoBarras: this.datosProducto.codigoDeBarras,
      nombre: this.datosProducto.nombre,
      cantidad: this.datosProducto.cantidad,
      precio: this.datosProducto.precio,
      estado: this.datosProducto.estado.toString(),
      })
    }
  }

  guardarEditar_Producto(){
    const _producto:Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      codigoDeBarras : this.formularioProducto.value.codigoBarras,
      nombre : this.formularioProducto.value.nombre,
      cantidad : this.formularioProducto.value.cantidad,
      precio : this.formularioProducto.value.precio,
      estado : parseInt(this.formularioProducto.value.estado),
    }

    if(this.datosProducto == null){
      this._productoService.guardar(_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue registrado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registar el producto", "Error")
          }
        },
        error:(e) => {}
      })
    }
    else{
      this._productoService.editar(_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue editado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el producto", "Error")
            console.log()
          }
        },
        error:(e) => {}
      })
    }



  }
}
