import { Component, Input } from '@angular/core';

import * as d3 from 'd3';

@Component({
    selector: 'app-controller',
    templateUrl: './controller.component.html',
    styleUrls: [
        './controller.component.css'
    ],
})
export class ControllerComponent {
    public nodes: any;
    @Input() data: any;
    @Input() options: any;

    constructor() {
        let colors = d3.schemeCategory10;
        this.nodes = this.range(5).map((d) => {
            return {
                id: d,
                color: colors[d]
            }
        });
    }

    range(N) {
        return Array.from(new Array(N),(val,index)=>index);
    }

}
