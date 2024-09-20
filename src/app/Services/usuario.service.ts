import { Injectable } from '@angular/core';

// recursos para solicitar las solicitudes de ApiRest
import { HttpClient } from '@angular/common/http';

// observables - recibir las respuestas de las apis
import { Observable, tap } from 'rxjs';

// environment - ahi esta la url de mi api rest
import { environment } from '../../environments/environment';

// interfaz - recibir las respuestas de nuestras solicitudes
import { ResponseApi } from '../Interfaces/response-api';

// para poder recibir las credenciales
import { Login } from '../Interfaces/login';

import { Usuario } from '../Interfaces/usuario';
import { response } from 'express';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // url a nuestro servicio
  private urlApi:string = environment.endpoint + "Usuario/";


  constructor(private http: HttpClient) { }
 
  iniciarSesion(request: Login): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}IniciarSesion`, request).pipe(
      tap((response: ResponseApi) =>{
        if(response.status) {
          localStorage.setItem('token', 'true');
        }
      })
    )
  }

  lista(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  guardar(request: Usuario): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }

  editar(request: Usuario): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminar(id: number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
