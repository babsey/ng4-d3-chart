import {
    Injectable,
    EventEmitter
} from '@angular/core';

@Injectable()
export class DataService {
    public changed: EventEmitter<any>;

    constructor() {
        this.changed = new EventEmitter();
    }

    reduce(data, maxVal) {
        if (data.length < maxVal) return data

        let delta = Math.floor(data.length / maxVal);
        let reducedData = data.filter(function(value, index, Arr) {
            return index % delta == 0;
        });

        return reducedData;
    }

    filter(data, options) {
        let xDomain = options.chart.xDomain;
        if (xDomain) {
            data = data.filter(function(d) {
                return d.x > xDomain[0] && d.x < xDomain[1]
            })
        }

        let yDomain = options.chart.yDomain;
        if (yDomain) {
            data = data.filter(function(d) {
                return d.y > yDomain[0] && d.y < yDomain[1]
            })
        }

        return data
    }

}
