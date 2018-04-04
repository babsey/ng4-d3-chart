import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.css'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})
export class NodeComponent {
    @Input() node: any = { id:-1 };
    @Input() options: any;

    constructor() {
    }

}
