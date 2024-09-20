import { Injectable } from '@angular/core';

// recursos para solicitar las solicitudes de ApiRest
import { HttpClient } from '@angular/common/http';

// observables - recibir las respuestas de las apis
import { Observable } from 'rxjs';

// environment - ahi esta la url de mi api rest
import { environment } from '../../environments/environment';

// interfaz - recibir las respuestas de nuestras solicitudes
import { ResponseApi } from '../Interfaces/response-api';

import { Proveedor } from '../Interfaces/proveedor';


@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private urlApi:string = environment.endpoint + "Proveedor/";

  constructor(private http: HttpClient) { }

  lista(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  guardar(request: Proveedor): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }

  editar(request: Proveedor): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminar(id: number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
