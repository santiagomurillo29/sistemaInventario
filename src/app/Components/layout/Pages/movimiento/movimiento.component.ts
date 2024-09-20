import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

import { ModalMovimientoComponent } from '../../Modales/modal-movimiento/modal-movimiento.component';
import { Movimiento } from '../../../../Interfaces/movimiento';
import { MovimientoService } from '../../../../Services/movimiento.service';

@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.css'
})
export class MovimientoComponent implements OnInit, AfterViewInit{

  columnasTabla: string[] =['nombreTipoMovimiento', 'descripcion', 'fecha', 'valor', 'acciones']
  dataInicio: Movimiento[] = [];
  dataListaMovmientos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator


  constructor(
    private dialog: MatDialog,
    private _movimientoServicio: MovimientoService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerMovimientos(){
    this._movimientoServicio.lista().subscribe({
      next: (data) => {
        if(data.status){
          this.dataListaMovmientos.data = data.value
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Error")
        }
      }, 
      error:(e) => { }
    })
  }

  ngOnInit(): void {
    this.obtenerMovimientos();
  }

  ngAfterViewInit(): void {
    this.dataListaMovmientos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaMovmientos.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoMovimiento(){
    this.dialog.open(ModalMovimientoComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerMovimientos();
      }
    });
  }

  editarMovimiento(moviemiento: Movimiento){
    this.dialog.open(ModalMovimientoComponent, {
      disableClose:true,
      data: moviemiento
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerMovimientos();
      }
    });
  }

  eliminarMovimiento(movimiento: Movimiento){
    Swal.fire({
      title: '¿Desea eliminar el movimiento?',
      text: movimiento.idMovimiento.toString(),
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this._movimientoServicio.eliminar(movimiento.idMovimiento).subscribe({
          next:(data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El movimiento fue eliminado","Exito")
              this.obtenerMovimientos();
            } else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el movimiento","Error")
            }
          }, error:(e) => {}
        })
      }
    })
  }


}