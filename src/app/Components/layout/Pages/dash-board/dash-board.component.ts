import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';

import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../../Services/dashboard.service';

// trabajar con graficos
Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent implements OnInit {
  totalIngresos: string = "0";
  totalVentas: string = "0";
  totalProductos: string = "0";

  constructor(
    private _dashBoardService: DashboardService
  ){}

  mostrarGrafico(labelGrafico:any[], dataGrafico:any[]){

    const chartBarras = new Chart('chartBarras', {
      type:'bar',
      data: {
        labels:labelGrafico,
        datasets: [{
          label:"# de Ventas",
          data: dataGrafico,
          backgroundColor:[
            'rgba(54, 162, 235, 0.2'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options:{
        maintainAspectRatio: false,
        responsive: true,
        scales:{
          y: {
            // inicio
            beginAtZero:true
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this._dashBoardService.resumen().subscribe({
      next:(data) => {
        if(data.status){
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          // info para pintar en el grafico
          // obtenemos la informacion 
          const arrayData: any[] = data.value.ventasUltimaSemana;

          const labelTemp = arrayData.map((value) => value.fecha)
          const dataTemp = arrayData.map((value) => value.total)
          this.mostrarGrafico(labelTemp, dataTemp)
        }  else{
          console.log("no encontro nada")
        }
      },
      error:(e) => { console.log("no encontro") }
    })
  }


}
