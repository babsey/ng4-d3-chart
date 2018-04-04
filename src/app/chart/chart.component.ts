import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
    @Input() data: any;
    @Input() options: any;

    constructor() {}
}
