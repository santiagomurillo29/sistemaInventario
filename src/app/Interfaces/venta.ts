import { DetalleVenta } from "./detalle-venta"

export interface Venta {
    idVenta?: number,
    idUsuario: number,
    descripcionUsuario?: string,
    idCliente: number,
    descripcionCliente?: string
    fechaRegistro?: string
    tblVentaDetalles: DetalleVenta[]
}
