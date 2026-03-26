import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  OcupacionParqueadero, 
  HistorialReserva, 
  FacturacionCompleta, 
  IngresosMensuales 
} from '../models/vistas.model';

@Injectable({
  providedIn: 'root'
})
export class VistasService {
  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) {}

  getOcupacion(idEmpresa?: number): Observable<OcupacionParqueadero[]> {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    return this.http.get<OcupacionParqueadero[]>(`${this.apiUrl}/views/ocupacion${params}`);
  }

  getHistorialReservas(idEmpresa?: number): Observable<HistorialReserva[]> {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    return this.http.get<HistorialReserva[]>(`${this.apiUrl}/views/historial-reservas${params}`);
  }

  getFacturacion(idEmpresa?: number): Observable<FacturacionCompleta[]> {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    return this.http.get<FacturacionCompleta[]>(`${this.apiUrl}/views/facturacion${params}`);
  }

  getIngresos(idEmpresa?: number): Observable<IngresosMensuales[]> {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    return this.http.get<IngresosMensuales[]>(`${this.apiUrl}/views/ingresos${params}`);
  }
}