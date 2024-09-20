import { format, isValid } from 'date-fns'; // Importa funciones de date-fns

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { FormBuilder,FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog'; // modales

import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment'


import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';

import { Venta } from '../../../../Interfaces/venta';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

import Swal from 'sweetalert2';
import { convertToParamMap } from '@angular/router';


// trabjar con el calendario
export const MY_DATA_FORMATS={
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule
  ],
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})

export class HistorialVentaComponent implements AfterViewInit {

  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    {value: "fecha", descripcion:"Por fechas"},
    {value: "numero", descripcion:"Numero de venta"}
  ];
  columnasTabla:string[] = ['fechaRegistro', 'idVenta', 'idUsuarioNombre', 'idClienteNombre', 'accion'];
  dataInicio: Venta[] = []; //establecer el formato de nuestra tabla
  datosListaVenta = new MatTableDataSource(this.dataInicio) // fuente de origen para la tabla
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ){
    // establecer los campos que va a tener el formulario
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'], // disparador para los 3 tipos de busqyueda
      numero: [''],
      fechaInicio: [''],
      fechaFin: ['']
    })
    // trabajar para cuando el buscarPor cambia
    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value => {
      this.formularioBusqueda.patchValue({
        numero: "",
        fechaInicio: "",
        fechaFin: ""
      })
    })

  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  // filtros
  aplicarFiltroTabla(event: Event){
    // obtener el valor
    const filterValue = (event.target as HTMLInputElement).value;

    //aplicar el filtro
    this.datosListaVenta.filter = filterValue.trim().toLocaleLowerCase();
  }



  buscarVentas(){
    console.log("Método buscarVentas llamado"); 

    let _fechaInicio: string = "";
    let _fechaFin: string = "";


    if(this.formularioBusqueda.value.buscarPor === "fecha"){

      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date"){
        this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Error")
        return;
      }
    } 


    this._ventaServicio.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin,

    ).subscribe({
      next: (data) => {
        if(data.status){
          this.datosListaVenta = new MatTableDataSource(data.value);
        } else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Error");
        }
      },
      error:(e) => {console.log("datos no recibidos", e)}
        
    })
  }


  verDetalleVenta(_venta: Venta) {
    this.dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: '700px'
    });
  }

  eliminarVenta(idVenta: number){
    Swal.fire({
      title: '¿Desea eliminar la Venta?',
      text: idVenta?.toString(),
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this._ventaServicio.eliminar(idVenta).subscribe({
          next:(data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("La venta fue eliminada","Exito")
            } else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar la venta","Error")
            }
          }, error:(e) => {}
        })
      }
    })
  }
}




  
  // editarDetalleVenta(_venta: Venta) {
  //   const datosModal = {
  //     ..._venta,
  //     idCliente: _venta.idCliente, // Asegúrate de tener esta propiedad
  //     idUsuario: _venta.idUsuario  // Asegúrate de tener esta propiedad
  //   };
  
  //   this.dialog.open(ModalEditarDetalleVentaComponent, {
  //     data: datosModal,
  //     disableClose: true,
  //     width: '700px'
  //   }).afterClosed().subscribe(resultado => {
  //     if (resultado === true) {
  //       this.buscarVentas();
  //     }
  //   });
  // }
  