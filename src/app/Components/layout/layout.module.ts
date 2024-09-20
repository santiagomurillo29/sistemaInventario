import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule
  ]
})
export class LayoutModule { }
