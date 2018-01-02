import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-controller',
    templateUrl: './controller.component.html',
    styleUrls: ['./controller.component.css'],
})
export class ControllerComponent {
    @Input() options: any;
    @Input() data: any;
    @Output() changed = new EventEmitter();

    update() {
        this.changed.emit()
    }
}
