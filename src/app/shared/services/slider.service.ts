import { Injectable } from '@angular/core';

@Injectable()
export class SliderService {
    public options: any;

    constructor() {
        this.options = [{
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
        }]
    }

}
