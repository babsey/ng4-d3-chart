import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatToolbarModule,
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { D3Service } from 'd3-ng2-service';
import { SliderService } from './shared/services/slider.service';
import { DataService } from './shared/services/data.service';
import { ChartService } from './shared/services/chart.service';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { LineChartComponent } from './chart/line-chart/line-chart.component';
import { ScatterChartComponent } from './chart/scatter-chart/scatter-chart.component';
import { ControllerComponent } from './controller/controller.component';
import { SliderComponent } from './controller/slider/slider.component';


@NgModule({
    declarations: [
        AppComponent,
        ChartComponent,
        ControllerComponent,
        LineChartComponent,
        ScatterChartComponent,
        SliderComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatToolbarModule,
        NoopAnimationsModule,
    ],
    providers: [
        ChartService,
        D3Service,
        DataService,
        SliderService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
