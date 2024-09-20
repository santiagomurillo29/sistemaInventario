import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit, AfterViewInit{
  
  columnasTable: string[] = ['codigoBarras', 'nombre', 'cantidad', 'precio', 'estado', 'acciones'];
  dataInicio: Producto[] = [];
  dataListaProducto = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator

  constructor(
    private dialog: MatDialog,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerProductos(){
    this._productoServicio.lista().subscribe({
      next: (data) => {
        if(data.status){
          this.dataListaProducto.data = data.value
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Error")
        }
      }, 
      error:(e) => {}
    })
  }


  
  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProducto.paginator = this.paginacionTabla;
  }


  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
  
    this.dataListaProducto.filter = filterValue.trim().toLocaleLowerCase();
  }

    // abril el modal
  nuevoProducto(){
    this.dialog.open(ModalProductoComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerProductos();
      }
    });
  }

  editarProducto(producto: Producto){
    this.dialog.open(ModalProductoComponent, {
      // si le da un click fuera del modal no se cierra
      disableClose:true,
      data: producto

      // afterClosed, obtenemos la respuesta despues de que se cierra
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerProductos();
      }
    });
  }



  eliminarProducto(producto: Producto){
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: producto.nombre,
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this._productoServicio.eliminar(producto.idProducto).subscribe({
          next:(data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El producto fue eliminado","Exito")
              this.obtenerProductos();
            } else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto","Error")
            }
          }, error:(e) => {}
        })
      }
    })
  }


}
