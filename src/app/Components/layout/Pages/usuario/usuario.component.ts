import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTable: string[] = ['nombre', 'apellido', 'documento', 'telefono', 'correo', 'usuario', 'contrasena', 'estado', 'rolDescripcion', 'acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
      next: (data) => {
        if(data.status){
          this.dataListaUsuarios.data = data.value
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Error")
        }
      }, 
      error:(e) => {}
    })
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  // filtros
  aplicarFiltroTabla(event: Event){
    // obtener el valor
    const filterValue = (event.target as HTMLInputElement).value;

    //aplicar el filtro
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  // abril el modal
  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      // si le da un click fuera del modal no se cierra
      disableClose:true

      // afterClosed, obtenemos la respuesta despues de que se cierra
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerUsuarios();
      }
    });
  }

  editarUsuario(usuario: Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      // si le da un click fuera del modal no se cierra
      disableClose:true,
      data: usuario

      // afterClosed, obtenemos la respuesta despues de que se cierra
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerUsuarios();
      }
    });
  }


  eliminarUsuario(usuario: Usuario){
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: usuario.nombre,
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next:(data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado","Exito")
              this.obtenerUsuarios();
            } else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario","Error")
            }
          }, error:(e) => {}
        })
      }
    })
  }

}
