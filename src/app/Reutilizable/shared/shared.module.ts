import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // <-- Importa el RouterModule


import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// angular material

// tarjetas
import {MatCardModule} from '@angular/material/card';
// input 
import {MatInputModule} from '@angular/material/input'
// select
import {MatSelectModule} from '@angular/material/select'
// barras de progreso
import {MatProgressBarModule} from '@angular/material/progress-bar'
// spinner de progreso
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
// filas y columnas
import {MatGridListModule} from '@angular/material/grid-list'

// contenedores
import {LayoutModule} from '@angular/cdk/layout'
// complementar menu
import {MatToolbarModule} from '@angular/material/toolbar'
// botones
import {MatButtonModule} from '@angular/material/button'
// nadvar
import {MatSidenavModule} from '@angular/material/sidenav'
// boton

//iconos
import {MatIconModule} from '@angular/material/icon'
// listas
import {MatListModule} from '@angular/material/list'

// data table - JQuery
import {MatTableModule} from '@angular/material/table'
// paginaciones de la tabla
import {MatPaginatorModule} from '@angular/material/paginator'
// dialogos 
import {MatDialogModule} from '@angular/material/dialog'
// mostrar alertas
import {MatSnackBarModule} from '@angular/material/snack-bar'
// pequeña alerta sobre un boton 
import {MatTooltipModule} from '@angular/material/tooltip'
// caja de texto, autocomplit
import {MatAutocompleteModule} from '@angular/material/autocomplete'
// trabajar cuadros de las fechas
import {MatDatepickerModule} from '@angular/material/datepicker'

// trabajar con fechas
import {MatNativeDateModule} from '@angular/material/core'
// convertir las fechas
import {MomentDateModule} from '@angular/material-moment-adapter'
// icono





@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ], 
  exports: [
    CommonModule,
    ReactiveFormsModule,FormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    RouterModule,
  ],
  providers:[
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule
  ]
})
export class SharedModule { }
