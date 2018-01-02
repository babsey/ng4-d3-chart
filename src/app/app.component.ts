import { Component, Input, OnInit } from '@angular/core';
import { randomNormal, range, extent } from 'd3';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    public options: any;
    public data: any[];

    constructor() {
        this.options = {
            slider: [{
                id: 'n',
                label: 'Number',
                value: 1000,
                min: 1,
                max: 2000,
                step: 1,
            }, {
                id: 'mean',
                label: 'Mean',
                value: 0.0,
                min: -1.,
                max: 1.,
                step: 0.01,
            }, {
                id: 'std',
                label: 'Standard deviation',
                value: 0.2,
                min: 0.,
                max: 1.,
                step: 0.01,
            }],
            chart: {
                height: 240,
                axis: 'left',
                transition: { duration: 500. },
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 20, right: 20, bottom: 30, left: 50 },
                scatter: {
                    padding: { top: 240, right: 0, bottom: 0, left: 0 },
                },
                line: {}
            }
        };
    }

    update() {
        console.log('Update app')
        let x: number[] = range(this.options.slider[0].value);
        let random = randomNormal(this.options.slider[1].value, this.options.slider[2].value)
        this.data = x.map((i) => { return { x: i, y: random() } });

        this.options.chart.xDomain0 = extent(this.data, function(d) { return d.x });
        this.options.chart.yDomain0 = extent(this.data, function(d) { return d.y });

        this.options.chart.xDomain = this.options.chart.xDomain0;
        this.options.chart.yDomain = this.options.chart.yDomain0;
    }

    log(data) {
        console.log(data)
    }

    ngOnInit() {
        console.log('Init app')
        this.update()
    }
}
