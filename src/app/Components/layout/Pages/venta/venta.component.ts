import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from '../../../../Services/producto.service';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

import { Producto } from '../../../../Interfaces/producto';
import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';

import Swal from 'sweetalert2';

import { TipoVenta } from '../../../../Interfaces/tipo-venta';
import { TipoVentaService } from '../../../../Services/tipo-venta.service';

// para agregar un cliente
import { ModalClienteComponent } from '../../Modales/modal-cliente/modal-cliente.component';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../../../../Services/cliente.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements AfterViewInit {

  // VENTA
  idVentaGenerado: number = 0;

  // EMPLEADO
  idEmpleado: number = 0;
  nombreEmpleado: string = "";

  // CLIENTE
  idCliente: number = 0;
  idTipoDePago: number = 0;


  // CLIENTES:
  nombreCliente: string = "";
  documentoCliente: string = "";
  telefonoCliente: string = "";
  correoCliente: string = "";
  listaClientes: any[] = [];  // Almacenar la lista completa de clientes
  listaClientesFiltro: any[] = [];  // Lista filtrada para autocompletar


  // lista de tipoVenta
  listaTiposVenta: TipoVenta[] = []

  // contener los productos
  listaProductos: Producto[] = [];
  // contener los filtros desde el contenedor de productos
  listaProductosFiltro: Producto[] = []

  // contener la lista de productos que va a contener para la venta
  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipoDePagoPorDefecto: string = "Efectivo"
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precioUnitario', 'subTotoal', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  // metodo para mientras este escribiendo el producto se auto complete
  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();  // lo ultimo por que se convierte en objeto producto

    // retorna la lista de productos
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService,
    private _clienteServicio: ClienteService,
    private _tipoVenta: TipoVentaService,

  ) {
    // obtener lista de clientes registrados
    this._clienteServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.listaClientes = data.value;  // Suponiendo que data.value es un array de clientes
        }
      },
      error: (e) => { }
    });

    // obtenemos la lista de tipos de venta
    this._tipoVenta.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.listaTiposVenta = data.value
        }
      },
      error: (e) => { }
    })

    // creamos los campos para nuestro formulario
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
      documentoCliente: ['', Validators.required],
      idTipoPago: ['', Validators.required]
    })

    //obtenemos lista de productos
    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[] //convertimos en array de productos

          // almacenar en lista de producto los productos con la condicion 
          this.listaProductos = lista.filter(p => p.estado == 1 && p.cantidad > 0)
        }
      },
      error: (e) => { }
    })

    this.formularioProductoVenta.get('documentoCliente')?.valueChanges.subscribe(value => {
      this.listaClientesFiltro = this.retornarClientesPorFiltro(value);
    });

    // evento para buscar con las letras que esta poniendo el usuario
    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      // se va a ostrar en un array como serie de opciones
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value)
    })
  }


  // método para filtrar clientes por documento
  retornarClientesPorFiltro(busqueda: any): any[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLowerCase() : busqueda.documento.toLowerCase();
    return this.listaClientes.filter(cliente => cliente.documento.toLowerCase().includes(valorBuscado));
  }

  // método para mostrar el cliente seleccionado
  mostrarCliente(cliente: any): string {
    return cliente ? `${cliente.documento} - ${cliente.nombre}` : '';
  }

  // método que se ejecuta cuando un cliente es seleccionado
  clienteSeleccionado(event: any): void {
    const clienteSeleccionado = event.option.value;
    this.nombreCliente = clienteSeleccionado.nombre;
    this.documentoCliente = clienteSeleccionado.documento;
    this.idCliente = clienteSeleccionado.idCliente;  // Almacenar ID del cliente
  }


  ngAfterViewInit(): void {
    // para obtener info del Usurio/EMple
    const usuario = this._utilidadServicio.obtenerSessionUsuario();

    if (usuario != null) {
      this.idEmpleado = usuario.idUsuario;
      this.nombreEmpleado = usuario.nombre;
    }
  }

  // cliente
  nuevoCliente() {
    this.dialog.open(ModalClienteComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        console.log("Bien")
      }
    });
  }


  // evento para mostrar el producto seleccionado
  mostrarProducto(producto: Producto): string {
    return producto.nombre
  }

  // evento para guardar temporalmente el producto que se ha seleccionado de la lista
  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  // evento para registar el producto elegido dentro de nuestra tabla para poder realizar la venta
  agregarProductoParaVenta() {
    // cantidad que se extrajo del formulario 
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precioUnitario: number = parseFloat(this.productoSeleccionado.precio);
    const _subTotal: number = _cantidad * _precioUnitario;
    this.totalPagar = this.totalPagar + _subTotal;

    const _tipoVentaId = this.formularioProductoVenta.value.idTipoPago; // ID del tipo de venta seleccionado

    // DETALLE DE VENTA
    // agregamos ya toda la informacion a la lista de productos para la venta que seria detalle venta
    const detalleVenta: DetalleVenta = {
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioUnitarioTexto: _precioUnitario.toFixed(3),
      subTotalTexto: _subTotal.toFixed(3),
      idTipoVenta: _tipoVentaId
   };
  
   this.listaProductosParaVenta.push(detalleVenta);

   
    // actualizr nuestra tabla
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

    // restablecer nuestro formulario
    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: '',
    })
  }

  // eliminar productos para vender
  eliminarProducto(detalle: DetalleVenta) {
    this.totalPagar = this.totalPagar - parseFloat(detalle.subTotalTexto),

      // retornando todos los productos que no coincidad con el id producto que estamos recibiendo para elimianr
      this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto != detalle.idProducto)

    // actualizr nuestra tabla
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }


  registrarDetallesVenta(idVenta: number) {
    const detallesConIdVenta = this.listaProductosParaVenta.map(detalle => ({
      idVenta: idVenta,
      idProducto: detalle.idProducto,
      descripcionProducto: detalle.descripcionProducto,
      cantidad: detalle.cantidad,
      precioUnitarioTexto: detalle.precioUnitarioTexto,
      subTotalTexto: detalle.subTotalTexto,
      idTipoVenta: detalle.idTipoVenta,
    }));

    // Crear el objeto de la venta, incluyendo los detalles
    const venta: Venta = {
      idUsuario: this.idEmpleado,
      idCliente: this.idCliente,
      tblVentaDetalles: detallesConIdVenta
    };
  }
  
  registrarVenta() {
    if (this.listaProductosParaVenta.length > 0) {

      this.bloquearBotonRegistrar = true;
      // Preparar el objeto de la venta, solo con la información principal
      const requestVenta: Venta = {
        idUsuario: this.idEmpleado,
        idCliente: this.idCliente,
        // No enviamos los detalles aún, los añadiremos después de obtener el idVenta
        tblVentaDetalles: [...this.listaProductosParaVenta]
      };

      // Enviar la solicitud de registro de venta
      this._ventaServicio.registrar(requestVenta).subscribe({

        next: (response) => {

          if (response.status) {
            // Ahora tenemos el idVenta, lo usamos para los detalles
            this.idVentaGenerado = response.value.idVenta;

            // Agregamos el idVenta a cada detalle
            this.listaProductosParaVenta.forEach(detalle => {
              detalle.idVenta = this.idVentaGenerado;
            });

            // Ahora enviamos los detalles de la venta con el idVenta
            this.registrarDetallesVenta(this.idVentaGenerado);

            // Limpiamos la lista y mostramos éxito
            this.totalPagar = 0;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta.data = this.listaProductosParaVenta;

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada',
              text: `Número de venta: ${this.idVentaGenerado}`
            });
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta", "Error");
            Swal.fire({
              icon: 'error',
              title: 'Venta No Registrada'
            });
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: (e) => {
          this._utilidadServicio.mostrarAlerta("Ocurrió un error al registrar la venta", "Error");
          this.bloquearBotonRegistrar = false;
        }
      });
    } else {
      this._utilidadServicio.mostrarAlerta("Debe agregar al menos un producto", "Advertencia");
    }
  }

}
