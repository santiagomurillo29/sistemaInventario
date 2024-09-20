import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { Venta } from '../../../../Interfaces/venta';

@Component({
  selector: 'app-modal-editar-detalle-venta',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './modal-editar-detalle-venta.component.html',
  styleUrls: ['./modal-editar-detalle-venta.component.css']
})
export class ModalEditarDetalleVentaComponent implements OnInit {
  formularioVenta: FormGroup;
  tituloAccion: string = "Editar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalEditarDetalleVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosVenta: any,
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioVenta = this.fb.group({
      cantidad: [this.datosVenta.cantidad, [Validators.required]],
      precioUnitarioTexto: [this.datosVenta.precioUnitarioTexto, [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Aquí puedes realizar alguna lógica adicional si es necesario
  }

  
  guardarCambios(): void {
    if (this.formularioVenta.valid) {
      // Asumiendo que tienes idUsuario e idCliente disponibles en el componente
      const requestVenta: Venta = {
        idUsuario: this.datosVenta.idUsuario,
        idCliente: this.datosVenta.idCliente,
        tblVentaDetalles: [
          {
            idVenta: this.datosVenta.idVenta,
            idProducto: this.datosVenta.idProducto,
            descripcionProducto: this.datosVenta.descripcionProducto,
            cantidad: this.formularioVenta.value.cantidad,
            precioUnitarioTexto: this.formularioVenta.value.precioUnitarioTexto,
            idTipoVenta: this.datosVenta.idTipoVenta,
            subTotalTexto: (this.formularioVenta.value.cantidad * this.formularioVenta.value.precioUnitarioTexto).toFixed(2) // Calcula el subtotal
          }
        ]
      };
      console.log(requestVenta)
  
      this._ventaService.actualizarVenta(requestVenta).subscribe({
        next: (response) => {
          console.log(requestVenta)
          if (response.status) {
            this.modalActual.close(true);
            this._utilidadServicio.mostrarAlerta("Detalles actualizados correctamente", "Éxito");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo actualizar los detalles", "Error");
          }
        },
        error: (e) => {
          this._utilidadServicio.mostrarAlerta("Ocurrió un error al actualizar los detalles", "Error");
        }
      });
    } else {
      this._utilidadServicio.mostrarAlerta("Por favor, complete todos los campos requeridos", "Advertencia");
    }
  }
  

}
