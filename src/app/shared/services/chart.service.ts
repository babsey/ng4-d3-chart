import { Injectable } from '@angular/core';

import { DataService } from './data.service';

import { extent } from 'd3';

@Injectable()
export class ChartService {
    private data: any;
    public options: any;

    constructor(_dataService: DataService) {
        this.data = _dataService;
        this.options = {
            height: 240,
            axis: 'both',
            zoomed: false,
            transition: { duration: 500. },
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            margin: { top: 20, right: 20, bottom: 30, left: 50 },
            scatter: {
                padding: { top: 250, right: 0, bottom: 0, left: 0 },
            },
            line: {},
        };
    }

    update() {
        let data = this.data.get();
        this.options.xDomain0 = extent(data, function(d) { return d.x });
        this.options.yDomain0 = extent(data, function(d) { return d.y });

        if (!this.options.zoomed) {
            this.options.xDomain = this.options.xDomain0;
            this.options.yDomain = this.options.yDomain0;
        }
    }
}
