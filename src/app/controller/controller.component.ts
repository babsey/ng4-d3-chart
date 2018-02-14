import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SliderService } from '../shared/services/slider.service';
import { DataService } from '../shared/services/data.service';
import { ChartService } from '../shared/services/chart.service';


@Component({
    selector: 'app-controller',
    templateUrl: './controller.component.html',
    styleUrls: ['./controller.component.css'],
})
export class ControllerComponent {
    private data: any
    private chart: any;
    public options: any;
    public nodes: any;

    constructor(_sliderService: SliderService, _dataService: DataService, _chartService: ChartService) {
        this.options = _sliderService.options;
        this.data = _dataService;
        this.chart = _chartService;
        this.nodes = [1,2,3];
    }

    update() {
        this.data.update()
        this.chart.update()
    }

}
