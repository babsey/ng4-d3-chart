import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
    @Input() options: any;
    @Input() data: any;
    @Output() changed = new EventEmitter();

    update() {
        this.changed.emit();
    }
}
