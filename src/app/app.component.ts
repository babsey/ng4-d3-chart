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
    public controllerOpened: boolean;

    constructor(_dataService: DataService, _chartService: ChartService) {
        this.data = _dataService;
        this.chart = _chartService;
    }

    dataShuffle() {
        this.data.shuffle()
        this.chartUpdate()
    }

    chartUpdate() {
        let graph = document.getElementById('graph');
        let chart = document.getElementById('chart');
        this.chart.options.width = graph.offsetWidth.toString();
        chart.setAttribute('width', this.chart.options.width);
        this.data.updatedAt = new Date();
        this.chart.update();
    }

    openedChange() {
        setTimeout(() => this.chartUpdate(), 400)
    }

    ngOnInit() {
        this.controllerOpened = true;
        this.data.update()
        this.chartUpdate()
    }

}
