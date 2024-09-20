import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalClienteComponent } from '../../Modales/modal-cliente/modal-cliente.component';
import { Cliente } from '../../../../Interfaces/cliente';
import { ClienteService } from '../../../../Services/cliente.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit, AfterViewInit {

  columnasTable: string[] = ['nombre', 'documento', 'telefono', 'correo', 'numeroCompras', 'acciones'];
  dataInicio: Cliente[] = [];
  numeroClientes: number = 0
  dataListaCliente = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator

  
  constructor(
    private dialog: MatDialog,
    private _clienteServicio: ClienteService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerClientes(){
    this._clienteServicio.lista().subscribe({
      next: (data) => {
        if(data.status){
          this.numeroClientes = data.value.length

          this.dataListaCliente.data = data.value
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Error")
        }
      }, 
      error:(e) => {}
    })
  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  ngAfterViewInit(): void {
    this.dataListaCliente.paginator = this.paginacionTabla;
  }

  
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaCliente.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoCliente(){
    this.dialog.open(ModalClienteComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerClientes();
      }
    });
  }

  editarCliente(cliente: Cliente){
    this.dialog.open(ModalClienteComponent, {
      disableClose:true,
      data: cliente
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerClientes();
      }
    });
  }

  eliminarCliente(cliente: Cliente){
    Swal.fire({
      title: '¿Desea eliminar el cliente?',
      text: cliente.nombre,
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this._clienteServicio.eliminar(cliente.idCliente).subscribe({
          next:(data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El cliente fue eliminado","Exito")
              this.obtenerClientes();
            } else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el cliente","Error")
            }
          }, error:(e) => {}
        })
      }
    })
  }
}
