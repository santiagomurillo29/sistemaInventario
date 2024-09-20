import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from '../../../../Interfaces/venta';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-detalle-venta',
  standalone: true,
  imports:[
    SharedModule,
    FormsModule
  ],
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent {

  fechaRegistro: string;
  numeroIdVenta: number;
  idUsuarioNombre: string;
  idClienteNombre: string;
  detalleVenta: DetalleVenta[]; 

  columnasTabla: string[] = ['producto', 'cantidad', 'precioUnitario', 'subTotal']; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: Venta) {
    this.fechaRegistro = data.fechaRegistro!;
    this.numeroIdVenta = data.idVenta!;
    this.idUsuarioNombre = data.descripcionUsuario!;
    this.idClienteNombre = data.descripcionCliente!;
    this.detalleVenta = data.tblVentaDetalles || []; // Usa un array vacío como valor por defecto
  }
}


