import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { ProductoProveedor } from '../Interfaces/producto-proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProductoProveedorService {

  private urlApi:string = environment.endpoint + "ProductoProveedor/";

  constructor(private http:HttpClient) { }

  lista(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  guardar(request: ProductoProveedor): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }

  editar(request: ProductoProveedor): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminar(id: number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }

}
