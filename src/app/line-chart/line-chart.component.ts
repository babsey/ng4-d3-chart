// https://bl.ocks.org/mbostock/3883245

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
  Transition,
  Line
} from 'd3-ng2-service';

@Component({
  selector: 'g[app-line-chart]',
  template: '',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnChanges {
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
  @Input() options: any;
  @Input() data: any;

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
    console.log('Change line chart')
    let d3 = this.d3;
    let selector = this.selector;
    let d3G = this.d3G;
    let line0: Line<any>;
    let line: Line<any>;

    this.xScale.domain(this.options.xDomain)
    this.yScale.domain(this.options.yDomain)
    selector.select<SVGGElement>('.axis--x').transition(this.t).call(this.xAxis);
    selector.select<SVGGElement>('.axis--y').transition(this.t).call(this.yAxis);

    // define the line
    line0 = d3.line()
      .x((d: any) => this.xScale(d.x))
      .y(this.yScale(0));

    // define the line
    line = d3.line()
      .x((d: any) => this.xScale(d.x))
      .y((d: any) => this.yScale(d.y));

    d3G.selectAll<SVGPathElement, number[]>('path')
      .data([this.data]).exit().remove();

    d3G.selectAll<SVGPathElement, number[]>('path')
      .data([this.data])
      .enter().append<SVGPathElement>('path')
      .attr("class", "line")
      .attr("d", line0);

    d3G.selectAll<SVGPathElement, number[]>('path')
      .data([this.data])
      .transition(this.t)
      .attr("d", line);
  }

  ngOnInit() {
    console.log('Init line chart')
    let self = this;
    let d3 = this.d3;
    let svg = this.svg;
    let t = this.t;
    let selector = this.selector;
    let d3G = this.d3G;
    let xScale = this.xScale;
    let yScale = this.yScale;
    let xAxis = this.xAxis;
    let yAxis = this.yAxis;
    let padding = this.options.line.padding || this.options.padding;
    let margin = this.options.line.margin || this.options.margin;
    let width: number;
    let height: number;
    let brush: BrushBehavior<any>;
    let idleTimeout: number | null;
    let idleDelay: number;
    let line0: Line<any>;
    let line: Line<any>;

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

      selector.select<SVGGElement>('.axis--x').transition(t).call(xAxis);
      selector.select<SVGGElement>('.axis--y').transition(t).call(yAxis);

      d3G.selectAll<SVGPathElement, number[]>('path')
        .transition(t)
        .attr("d", line);

    }

    if (this.parentNativeElement !== null) {
      svg = this.svg = d3.select(this.parentNativeElement.parentElement);
      t = this.t = svg.transition().duration(500);
      selector = this.selector = svg.select<SVGGElement>('g[app-line-chart]');
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

      // define the line
      line0 = d3.line()
        .x((d: any) => xScale(d.x))
        .y(yScale(0));

      // define the line
      line = d3.line()
        .x((d: any) => xScale(d.x))
        .y((d: any) => yScale(d.y));

      d3G = this.d3G = selector.append<SVGGElement>('g')
        .attr('class', 'lines');

      d3G.selectAll<SVGPathElement, number[]>('path')
        .data([this.data])
        .enter().append<SVGPathElement>('path')
        .attr("class", "line")
        .attr("d", line0);

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

      selector.select<SVGGElement>('g.overlay')
        .attr('height', height)
        .attr('width', width);

      update()

    }

  }

}
