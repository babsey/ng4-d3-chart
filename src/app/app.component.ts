import { Component, Input, OnInit } from '@angular/core';
import { randomNormal, range } from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public options: any;
  public data: any;

  update() {
    console.log('Update app')
    let random: any;
    let x: number[];
    let y: number[];

    x = range(this.options.slider[0].value);
    random = randomNormal(this.options.slider[1].value, this.options.slider[2].value)
    this.data = x.map((i) => { return { x: i, y: random() } });
  }

  log(data) {
    console.log(data)
  }

  ngOnInit() {
    console.log('Init app')
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
        axis: 'both',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        margin: { top: 20, right: 20, bottom: 30, left: 50 },
        scatter: {
          padding: { top: 240, right: 0, bottom: 0, left: 0 },
        },
        line: {}
      }
    };
    this.update()
  }
}
