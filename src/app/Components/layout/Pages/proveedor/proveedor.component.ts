import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProveedorComponent } from '../../Modales/modal-proveedor/modal-proveedor.component';
import { Proveedor } from '../../../../Interfaces/proveedor';
import { ProveedorService } from '../../../../Services/proveedor.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css'
})
export class ProveedorComponent implements OnInit, AfterViewInit {

  columnasTable: string[] = ['nombre', 'documento', 'telefono', 'correo', 'estado', 'acciones'];
  dataInicio: Proveedor[] = [];
  dataListaProveedor = new MatTableDataSource(this.dataInicio); //  tabla con los valores de dataInicio que es la interfaz 
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator

  constructor(
    private dialog: MatDialog,
    private _proveedorServicio: ProveedorService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerProveedores(){
    this._proveedorServicio.lista().subscribe({
      next: (data) => {
        if(data.status){
          this.dataListaProveedor.data = data.value
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Error")
        }
      }, 
      error:(e) => {}
    })
  }


  ngOnInit(): void {
    this.obtenerProveedores();
  }

  ngAfterViewInit(): void {
    this.dataListaProveedor.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProveedor.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProveedor(){
    this.dialog.open(ModalProveedorComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerProveedores();
      }
    });
  }

  
  editarProveedor(proveedor: Proveedor){
    this.dialog.open(ModalProveedorComponent, {
      disableClose:true,
      data: proveedor
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerProveedores();
      }
    });
  }

  eliminarProveedor(proveedor: Proveedor){
    Swal.fire({
      title: '¿Desea eliminar el proveedor?',
      text: proveedor.nombre,
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver'
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._proveedorServicio.eliminar(proveedor.idProveedor).subscribe({
          next:(data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El proveedor fue eliminado","Exito")
              this.obtenerProveedores();
            } else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el proveedor", "Error")
            }
          }, error:(e) => {}
        })
      }
    })
  }
  

}
