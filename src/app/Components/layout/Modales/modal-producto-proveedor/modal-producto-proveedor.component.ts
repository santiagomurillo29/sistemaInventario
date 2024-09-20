import { Component, OnInit, Inject } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// traer
import { Producto } from '../../../../Interfaces/producto';
import { Proveedor } from '../../../../Interfaces/proveedor';

import { ProductoService } from '../../../../Services/producto.service';
import { ProveedorService } from '../../../../Services/proveedor.service';

// original
import { ProductoProveedor } from '../../../../Interfaces/producto-proveedor';
import { ProductoProveedorService } from '../../../../Services/producto-proveedor.service';

import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto-proveedor',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './modal-producto-proveedor.component.html',
  styleUrls: ['./modal-producto-proveedor.component.css']
})
export class ModalProductoProveedorComponent implements OnInit {
  
  formularioProductoProveedor: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaProductos: Producto[] = []
  listaProveedores: Proveedor[] = []

  constructor(
    private modalActual: MatDialogRef<ModalProductoProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) /* decorar que indica que vamos a recibir algo */ public datosPP: ProductoProveedor,
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _proveedorServicio: ProveedorService,
    private _productoProveedorServicio: ProductoProveedorService,
    private _utilidadServicio: UtilidadService
  ){
    // campos que vamos a recibir en el formulario del html
    this.formularioProductoProveedor = this.fb.group({
      idProducto: ['', Validators.required],
      idProveedor: ['', Validators.required]
    });

    if (this.datosPP != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar"
    }

    this._productoServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          this.listaProductos = data.value;
        }
      },
      error:(e) => {}
    });

    this._proveedorServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          this.listaProveedores = data.value;
        }
      },
      error:(e) => {}
    });
  }

  

  ngOnInit(): void {
    if(this.datosPP != null){
      this.formularioProductoProveedor.patchValue({
      idProducto: this.datosPP.idProducto,
      idProveedor: this.datosPP.idProveedor,
      });
    }
  }



  guardarEditar_PP(){
    const _PP: ProductoProveedor = {
      idProductoProveedor: this.datosPP == null ? 0 : this.datosPP.idProductoProveedor,
      idProducto: this.formularioProductoProveedor.value.idProducto,
      idProveedor: this.formularioProductoProveedor.value.idProveedor,
      nombreProducto: "",
      nombreProveedor: ""
    }

    if(this.datosPP == null){
      this._productoProveedorServicio.guardar(_PP).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("La relacion producto/proveedor fue registrado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registar la relacion producto/proveedor", "Error")
          }
        },
        error:(e) => {}
      })
    }
    else{
      this._productoProveedorServicio.editar(_PP).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("La relacion producto/proveedor fue editado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar la relacion producto/proveedor", "Error")
          }
        },
        error:(e) => {}
      })
    }

  }

}
