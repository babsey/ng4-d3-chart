import { Component, Input, NgZone, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  Selection,
  Transition
} from 'd3-ng2-service';

@Component({
  selector: 'g[app-scatter-chart]',
  template: '',
  styleUrls: ['./scatter-chart.component.css'],
})
export class ScatterChartComponent implements OnInit, OnChanges {
  private d3: D3;
  private parentNativeElement: any;
  private svg: Selection<SVGSVGElement, any, null, undefined>;
  private t: Transition<SVGSVGElement, any, null, undefined>;
  private selector: Selection<SVGGElement, any, null, undefined>;
  private d3G: Selection<SVGGElement, any, null, undefined>;
  private xScale: ScaleLinear<number, number>;
  private yScale: ScaleLinear<number, number>;
  private xAxis: Axis<number>;
  private yAxis: Axis<number>;
  private padding = { top: 0, right: 0, bottom: 0, left: 0 };
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  @Input() options: any;
  @Input() height: number;
  @Input() data;

  constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data.length == 0) return
    for (let propName in changes) {
      let change = changes[propName];
      let curVal = JSON.stringify(change.currentValue);
      let prevVal = JSON.stringify(change.previousValue);
      if (prevVal == undefined) return
    }
    console.log('Change scatter chart')
    let d3 = this.d3;
    let selector = this.selector;
    let d3G = this.d3G;

    this.xScale.domain(this.options.xDomain)
    this.yScale.domain(this.options.yDomain)
    selector.select<SVGGElement>('.axis--x').transition(this.t).call(this.xAxis);
    selector.select<SVGGElement>('.axis--y').transition(this.t).call(this.yAxis);

    d3G.selectAll<SVGCircleElement, any>('.dot')
      .data(this.data)
      .exit().remove();

    d3G.selectAll<SVGCircleElement, any>('.dot')
      .data(this.data)
      .enter().append<SVGCircleElement>('circle')
      .attr("class", "dot")
      .attr('cx', (d: any) => this.xScale(d.x))
      .attr('cy', this.yScale(0))
      .attr('r', 2.5);

    d3G.selectAll<SVGCircleElement, [number, number, number]>('.dot')
      .data(this.data)
      .transition(this.t)
      .attr('cx', (d: any) => this.xScale(d.x))
      .attr('cy', (d: any) => this.yScale(d.y))
  }

  ngOnInit() {
    console.log('Init scatter chart')
    let self = this;
    let d3 = this.d3;
    let svg = this.svg;
    let t = this.t;
    let selector = this.selector;
    let d3G = this.d3G;
    let data = this.data;
    let xScale = this.xScale;
    let yScale = this.yScale;
    let xAxis = this.xAxis;
    let yAxis = this.yAxis;
    let padding = this.options.scatter.padding || this.options.padding;
    let margin = this.options.scatter.margin || this.options.margin;
    let width: number;
    let height: number;
    let brush: BrushBehavior<any>;
    let idleTimeout: number | null;
    let idleDelay: number;

    function brushended(this: SVGGElement) {
      let e = <D3BrushEvent<any>>d3.event;
      let s: BrushSelection = e.selection;
      if (!s) {
        if (!idleTimeout) {
          self.ngZone.runOutsideAngular(() => {
            idleTimeout = window.setTimeout(idled, idleDelay);
          });
          return idleTimeout;
        }
        xScale.domain(self.options.xDomain);
        yScale.domain(self.options.yDomain);
      } else {
        xScale.domain([s[0][0], s[1][0]].map(xScale.invert, xScale));
        yScale.domain([s[1][1], s[0][1]].map(yScale.invert, yScale));
        selector.select<SVGGElement>('.brush').call(brush.move, null);
      }
      update();
    }

    function idled() {
      idleTimeout = null;
    }

    function update() {
      selector.select<SVGGElement>('.axis--x').transition(t).call(self.xAxis);
      selector.select<SVGGElement>('.axis--y').transition(t).call(self.yAxis);

      d3G.selectAll<SVGCircleElement, [number, number, number]>('.dot')
        .data(self.data)
        .transition(t)
        .attr('cx', (d: any) => xScale(d.x))
        .attr('cy', (d: any) => yScale(d.y))

      d3G.selectAll<SVGCircleElement, any>('.dot')
        .data(self.data)
        .enter().append<SVGCircleElement>('circle')
        .attr("class", "dot")
        .attr('cx', (d: any) => xScale(d.x))
        .attr('cy', yScale(0))
        .attr('r', 2.5);
    }

    if (this.parentNativeElement !== null) {
      svg = this.svg = d3.select(this.parentNativeElement.parentElement);
      t = this.t = svg.transition().duration(500);
      selector = this.selector = svg.select<SVGGElement>('g[app-scatter-chart]');
      width = (this.options.width || +svg.attr('width')) - margin.left - margin.right;
      height = (this.options.height || +svg.attr('height')) - margin.top - margin.bottom;
      selector.attr('transform', 'translate(' +
        (padding.left + margin.left) + ',' +
        (padding.top + margin.top) + ')')

      if (this.data.length == 0) return
      xScale = this.xScale = d3.scaleLinear().domain(this.options.xDomain).range([0, width]);
      yScale = this.yScale = d3.scaleLinear().domain(this.options.yDomain).range([height, 0]);

      xAxis = this.xAxis = d3.axisBottom<number>(xScale).ticks(12);
      yAxis = this.yAxis = d3.axisLeft<number>(yScale).ticks(12 * height / width);

      brush = d3.brush().on('end', brushended);
      idleDelay = 350;

      d3G = this.d3G = selector.append<SVGGElement>('g')
        .attr('class', 'dots');

      d3G.selectAll<SVGCircleElement, any>('circle')
        .data(this.data)
        .enter().append<SVGCircleElement>('circle')
        .attr("class", "dot")
        .attr('cx', (d: any) => xScale(d.x))
        .attr('cy', yScale(0))
        .attr('r', 2.5);

      if (this.options.axis == 'bottom' || this.options.axis == 'both') {
        selector.append<SVGGElement>('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
      }
      if (this.options.axis == 'right' || this.options.axis == 'both') {
        selector.append<SVGGElement>('g')
          .attr('class', 'axis axis--y')
          .call(yAxis);

        // selector.selectAll('.domain')
        //   .style('display', 'none');
      }

      selector.append<SVGGElement>('g')
        .attr('class', 'brush')
        .call(brush);

      selector.select<SVGGElement>('.overlay')
        .attr('height', height)
        .attr('width', width);

      update()

    }

  }

}
