import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Venta } from '../Interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi:string = environment.endpoint + "Venta/";

  constructor(private http:HttpClient) { }

  registrar(request: Venta): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Registrar`, request)
  }

  historial(buscarPor:string, numeroVenta:string, fechaInicio:string, fechaFinal:string ): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`)
  }

  actualizarVenta(request: Venta): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Actualizar`, request)
  }

  eliminar(id: number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
