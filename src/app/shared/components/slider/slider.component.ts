import { Component, Input } from '@angular/core';

import { DataService } from '../../services/data.service';


@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css']
})
export class SliderComponent {
    @Input() options: any;

    constructor(private _dataService: DataService) {
    }

    changed() {
        this._dataService.changed.emit(this)
    }
}
