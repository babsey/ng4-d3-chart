import { Injectable } from '@angular/core';
import { randomNormal, range } from 'd3';

import { SliderService } from './slider.service';


@Injectable()
export class DataService {
    private options: any;
    private _data: any;
    private _reduced: any;
    public updatedAt: any;

    constructor(_sliderService: SliderService) {
        this.options = _sliderService.options;
    }

    get() {
        return this._reduced;
    }

    reduce(data, maxVal) {
        if (data.length < maxVal) return data

        var delta = Math.floor(data.length / maxVal);
        let reduced = data.filter(function(value, index, Arr) {
            return index % delta == 0;
        });

        return reduced;
    }

    filter(data) {
        let xDomain = this.options.chart.xDomain;
        if (xDomain) {
            data = data.filter(function(d) {
                return d.x > xDomain[0] && d.x < xDomain[1]
            })
        }

        let yDomain = this.options.chart.yDomain;
        if (yDomain) {
            data = data.filter(function(d) {
                return d.y > yDomain[0] && d.y < yDomain[1]
            })
        }

        return data
    }

    update() {
        let n: number = this.options[0].value;
        let mean: number = this.options[1].value;
        let std: number = this.options[2].value;

        let random = randomNormal(mean, std);
        this._data = range(n).map((i) => { return { x: i, y: random() } });
        this._reduced = this.reduce(this._data, 5000);
        this.updatedAt = new Date();
    }

}
