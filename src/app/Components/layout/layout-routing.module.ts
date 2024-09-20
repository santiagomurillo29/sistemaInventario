import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { ProveedorComponent } from './Pages/proveedor/proveedor.component';
import { ProductoProveedorComponent } from './Pages/producto-proveedor/producto-proveedor.component';
import { ClienteComponent } from './Pages/cliente/cliente.component';
import { MovimientoComponent } from './Pages/movimiento/movimiento.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { VentaComponent } from './Pages/venta/venta.component';


const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[
    // cuando el usuario vaya a la ruta, se crea el componente
    {path:'dashBoard', component:DashBoardComponent},
    {path:'usuario', component:UsuarioComponent},
    {path:'producto', component:ProductoComponent},
    {path:'proveedor', component:ProveedorComponent},
    {path:'productoProveedor', component:ProductoProveedorComponent},
    {path:'cliente', component:ClienteComponent},
    {path:'movimiento', component:MovimientoComponent},
    {path:'historial', component:HistorialVentaComponent},
    {path:'venta', component:VentaComponent}
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
