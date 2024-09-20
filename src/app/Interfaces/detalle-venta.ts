export interface DetalleVenta {
    idVentaDetalle?: number,
    idVenta?: number,
    idProducto: number,
    descripcionProducto: string,
    cantidad: number,
    precioUnitarioTexto: string,
    subTotalTexto: string,
    idTipoVenta: number,
    descripcionTipoVenta?: string
}
