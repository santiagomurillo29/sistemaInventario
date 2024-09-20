import { Component, OnInit, Inject } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TipoMovmiento } from '../../../../Interfaces/tipo-movmiento';
import { TipoMovimientoService } from '../../../../Services/tipo-movimiento.service';

import { Movimiento } from '../../../../Interfaces/movimiento';
import { MovimientoService } from '../../../../Services/movimiento.service';

import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment'


export const MY_DATA_FORMATS={
  parse:{
    dateInput: 'YYYY/MM/DD'
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-modal-movimiento',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './modal-movimiento.component.html',
  styleUrls: ['./modal-movimiento.component.css'],
  providers: [{provide:MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}]
})
export class ModalMovimientoComponent implements OnInit{

  formularioMovimiento: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaTipoMovimiento: TipoMovmiento[] = []

  constructor(
    private modalActual: MatDialogRef<ModalMovimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosMovimiento: Movimiento,
    private fb: FormBuilder,
    private _tipoMovimientoServicio: TipoMovimientoService,
    private _movimientoServicio: MovimientoService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioMovimiento = this.fb.group({
      idTipoMovimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      valor: ['', Validators.required],
    });

    if (this.datosMovimiento != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar"
    }

    this._tipoMovimientoServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          this.listaTipoMovimiento = data.value
        }
      }, error:(e) => {}
    })

  }

  ngOnInit(): void {
    if(this.datosMovimiento != null){
      this.formularioMovimiento.patchValue({
        idTipoMovimiento: this.datosMovimiento.idTipoMovimiento,
        descripcion: this.datosMovimiento.descripcion,
        fecha: this.datosMovimiento.fecha,
        valor: this.datosMovimiento.valor
      })
    }
  }


  guardarEditar_Movimiento(){
    const _movimiento:Movimiento = {
      idMovimiento: this.datosMovimiento == null ? 0 : this.datosMovimiento.idMovimiento,
      idTipoMovimiento : this.formularioMovimiento.value.idTipoMovimiento,
      nombreTipoMovimiento : "",
      descripcion : this.formularioMovimiento.value.descripcion,
      fecha : this.formularioMovimiento.value.fecha,
      valor : this.formularioMovimiento.value.valor,
    }

    if(this.datosMovimiento == null){
      this._movimientoServicio.guardar(_movimiento).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El movimiento fue registrado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registar el movimiento", "Error")
            console.log(data.msg)
          }
        },
        error:(e) => {console.log("no se guardo")}
      })
    }
    else{
      this._movimientoServicio.editar(_movimiento).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El movimiento fue editado","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el movimiento", "Error")
          }
        },
        error:(e) => {}
      })
    }
  }

}
