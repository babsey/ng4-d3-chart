import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';

import { D3Service } from 'd3-ng2-service';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { LineChartComponent } from './chart/line-chart/line-chart.component';
import { ScatterChartComponent } from './chart/scatter-chart/scatter-chart.component';
import { ControllerComponent } from './controller/controller.component';
import { SliderComponent } from './controller/slider/slider.component';


@NgModule({
    declarations: [
        AppComponent,
        ControllerComponent,
        SliderComponent,
        ChartComponent,
        LineChartComponent,
        ScatterChartComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MatInputModule,
        MatCardModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatSliderModule,
    ],
    providers: [
        D3Service
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
