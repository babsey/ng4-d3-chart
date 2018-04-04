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
import { ChartService } from './shared/services/chart.service';
import { ControllerService } from './shared/services/controller.service';
import { DataService } from './shared/services/data.service';

import { LineChartComponent } from './shared/components/line-chart/line-chart.component';
import { ScatterChartComponent } from './shared/components/scatter-chart/scatter-chart.component';
import { SliderComponent } from './shared/components/slider/slider.component';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { NodeComponent } from './controller/node/node.component';
import { ControllerComponent } from './controller/controller.component';


@NgModule({
    declarations: [
        AppComponent,
        ChartComponent,
        ControllerComponent,
        LineChartComponent,
        NodeComponent,
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
        D3Service,
        ChartService,
        ControllerService,
        DataService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
