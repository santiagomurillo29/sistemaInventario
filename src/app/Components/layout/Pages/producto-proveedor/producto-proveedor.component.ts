import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoProveedorComponent } from '../../Modales/modal-producto-proveedor/modal-producto-proveedor.component';
import { ProductoProveedor } from '../../../../Interfaces/producto-proveedor';
import { ProductoProveedorService } from '../../../../Services/producto-proveedor.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-proveedor',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './producto-proveedor.component.html',
  styleUrl: './producto-proveedor.component.css'
})
export class ProductoProveedorComponent implements OnInit, AfterViewInit {

  columnasTablas: string[] = ['idProducto', 'idProveedor', 'acciones'];
  dataInicio: ProductoProveedor[] =[];
  dataListaPP = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator

  constructor(
    private dialog: MatDialog,
    private _PPServicio: ProductoProveedorService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerPP(){
    this._PPServicio.lista().subscribe({
      next: (data) => {
        if(data.status){
          this.dataListaPP.data = data.value
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Error")
        }
      }, 
      error:(e) => {}
    })
  }

  ngOnInit(): void {
    this.obtenerPP();
  }

  ngAfterViewInit(): void {
    this.dataListaPP.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaPP.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoPP(){
    this.dialog.open(ModalProductoProveedorComponent, {
      disableClose:true
      }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerPP();
      }
    });
  }

  editarPP(pp: ProductoProveedor){
    this.dialog.open(ModalProductoProveedorComponent, {
      disableClose:true,
      data: pp

    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerPP();
      }
    });
  }

  eliminarPP(pp: ProductoProveedor){
    Swal.fire({
      title: '¿Desea eliminar la relacion producto proveedor?',
      text: pp.nombreProducto + " " + pp.nombreProveedor,
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this._PPServicio.eliminar(pp.idProductoProveedor).subscribe({
          next:(data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("la relacion producto proveedor fue eliminado","Exito")
              this.obtenerPP();
            } else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar la relacion producto proveedor","Error")
            }
          }, error:(e) => {}
        })
      }
    })
  }

}
