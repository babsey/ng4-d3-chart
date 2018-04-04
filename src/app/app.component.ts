import { Component, OnInit } from '@angular/core';
import { randomNormal, range } from 'd3';

import { DataService } from './shared/services/data.service';
import { ChartService } from './shared/services/chart.service';
import { ControllerService } from './shared/services/controller.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    public data: any;
    public chartOptions: any;
    public controllerOptions: any;
    private params: any;

    constructor(private _dataService: DataService, private _chartService: ChartService, _controllerService: ControllerService) {
        this.chartOptions = this._chartService.options;
        this.controllerOptions = _controllerService.options;
        this.params = {
            n: 1000,
            mean: 0.0,
            std: 0.2,
        };
    }

    dataUpdate() {
        // console.log('Update data')
        let random = randomNormal(this.params.mean, this.params.std);
        this.data = range(this.params.n).map((i) => { return { x: i, y: random() } });
    }

    controllerUpdate() {
        // console.log('Update controller')
        this.controllerOptions.slider[0].value = this.params.n;
        this.controllerOptions.slider[1].value = this.params.mean;
        this.controllerOptions.slider[2].value = this.params.std;
    }

    chartResize() {
        // console.log('Resize chart')
        let graph = document.getElementById('graph');
        let chart = document.getElementById('chart');
        let width = graph.offsetWidth;
        chart.setAttribute('width', width.toString());
        this.chartOptions.width = width;
        this._chartService.changed.emit()
    }

    paramsShuffle() {
        // console.log('Shuffle params')
        this.params.n = parseInt(randomNormal(1000, 300)());
        this.params.mean = randomNormal(0, 0.5)();
        this.params.std = randomNormal(0.5, 0.15)();
        delete this.chartOptions.xDomain;
        this.dataUpdate()
        this.controllerUpdate()
    }

    ngOnInit() {
        this._dataService.changed.subscribe((d) => {
            this.params[d.options.id] = d.options.value;
            this.dataUpdate()
            if (d.options.id == 'n') {
                delete this.chartOptions.xDomain;
            }
        })

        this.dataUpdate()
        this.controllerUpdate()
        setTimeout(() => this.chartResize(), 100)
    }

    sidenavToggle(sidenav) {
        sidenav.toggle()
        setTimeout(() => this.chartResize(), 500)
    }


}
