import { Component, Input, OnInit } from '@angular/core';
import { extent } from 'd3';

import { DataService } from './shared/services/data.service';
import { ChartService } from './shared/services/chart.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    private data: any;
    private chart: any;

    constructor(_dataService: DataService, _chartService: ChartService) {
        this.data = _dataService;
        this.chart = _chartService;
    }

    log(data) {
        console.log(data)
    }

    ngOnInit() {
        this.data.update()
        this.chart.update()
    }

}
