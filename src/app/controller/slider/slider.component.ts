import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { DataService } from '../../shared/services/data.service';
import { ChartService } from '../../shared/services/chart.service';


@Component({
    selector: 'app-slider',
    templateUrl: 'slider.component.html',
    styleUrls: ['slider.component.css'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
})
export class SliderComponent {
    private data: any;
    private chart: any;
    @Input() options: any;

    constructor(_dataService: DataService, _chartService: ChartService) {
        this.data = _dataService;
        this.chart = _chartService;
    }

    onChange() {
        this.data.update();
        this.chart.update();
    }

}
