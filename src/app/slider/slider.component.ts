import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class SliderComponent {
  @Input() options: any;
  @Output() changed = new EventEmitter();

  onChange() {
    this.changed.emit();
  }
}
