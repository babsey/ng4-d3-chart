// https://bl.ocks.org/mbostock/3883245

import { Component, NgZone, ElementRef, OnInit } from '@angular/core';

import { ChartService } from '../../shared/services/chart.service';
import { DataService } from '../../shared/services/data.service';

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
export class LineChartComponent implements OnInit {
    private d3: D3;
    private nativeElement: any;
    private svg: Selection<SVGSVGElement, any, null, undefined>;
    private selector: Selection<SVGGElement, any, null, undefined>;
    private d3G: Selection<SVGGElement, any, null, undefined>;
    private width: Axis<number>;
    private height: Axis<number>;
    private xScale: ScaleLinear<number, number>;
    private yScale: ScaleLinear<number, number>;
    private xAxis: Axis<number>;
    private yAxis: Axis<number>;
    private options: any;
    private data: any;
    private updatedAt;

    constructor(element: ElementRef, private ngZone: NgZone, _d3Service: D3Service, _chartService: ChartService, _dataService: DataService) {
        this.d3 = _d3Service.getD3();
        this.nativeElement = element.nativeElement;
        this.svg = this.d3.select(this.nativeElement.parentElement);
        this.selector = this.svg.select<SVGGElement>('g[app-line-chart]');
        this.d3G = this.selector.append<SVGGElement>('g').attr('class', 'lines');
        this.options = _chartService.options;
        this.data = _dataService;
    }

    update() {
        let data = this.data.get();
        if (data.length == 0) return
        // console.log('Update line chart')
        let d3 = this.d3;
        let svg = this.svg;
        let selector = this.selector;
        let d3G = this.d3G;
        let line: Line<any>;
        let t: Transition<SVGSVGElement, any, null, undefined>;

        this.xScale.domain(this.options.xDomain);
        this.yScale.domain(this.options.yDomain);

        t = svg.transition().duration(this.options.transition.duration || 500);

        selector.select<SVGGElement>('.axis--x').transition(t).call(this.xAxis);
        selector.select<SVGGElement>('.axis--y').transition(t).call(this.yAxis);

        // define the line
        line = d3.line()
            .x((d: any) => this.xScale(d.x))
            .y((d: any) => this.yScale(d.y));

        d3G.selectAll<SVGPathElement, number[]>('path')
            .data([data])
            .transition(t)
            .attr("d", line);

        this.updatedAt = this.data.updatedAt;
    }

    ngDoCheck() {
        if (this.updatedAt == this.data.updatedAt) return
        this.update();
    }

    ngOnInit() {
        let self = this;
        let d3 = this.d3;
        let selector = this.selector;
        let d3G = this.d3G;
        let padding = this.options.line.padding || this.options.padding;
        let margin = this.options.line.margin || this.options.margin;
        let width: number;
        let height: number;
        let brush: BrushBehavior<any>;
        let idleTimeout: number | null;
        let idleDelay: number;
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
                self.options.xDomain = self.options.xDomain0;
                self.options.yDomain = self.options.yDomain0;
                self.options.zoomed = false;
            } else {
                self.options.xDomain = [s[0][0], s[1][0]].map(self.xScale.invert, self.xScale)
                self.options.yDomain = [s[1][1], s[0][1]].map(self.yScale.invert, self.yScale)
                selector.select<SVGGElement>('.brush').call(brush.move, null);
                self.options.zoomed = true;
            }
            self.data.updatedAt = new Date();
        }

        function idled() {
            idleTimeout = null;
        }

        if (this.nativeElement !== null) {
            selector.attr('transform', 'translate(' +
                (padding.left + margin.left) + ',' +
                (padding.top + margin.top) + ')')
            width = (this.options.width || +this.svg.attr('width')) - margin.left - margin.right;
            height = (this.options.height || +this.svg.attr('height')) - margin.top - margin.bottom;

            this.xScale = d3.scaleLinear().domain(this.options.xDomain).range([0, width]);
            this.yScale = d3.scaleLinear().domain(this.options.yDomain).range([height, 0]);

            this.xAxis = d3.axisBottom<number>(this.xScale).ticks(12);
            this.yAxis = d3.axisLeft<number>(this.yScale).ticks(12 * height / width);

            brush = d3.brush().on('end', brushended);
            idleDelay = 350;

            let axis = this.options.axis || this.options.line.axis;
            if (axis == 'bottom' || axis == 'both') {
                selector.append<SVGGElement>('g')
                    .attr('class', 'axis axis--x')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(this.xAxis);
            }
            if (axis == 'left' || axis == 'both') {
                selector.append<SVGGElement>('g')
                    .attr('class', 'axis axis--y')
                    .call(this.yAxis);

                // selector.selectAll('.domain')
                //   .style('display', 'none');
            }

            selector.append<SVGGElement>('g')
                .attr('class', 'brush')
                .call(brush);

            selector.select<SVGGElement>('.overlay')
                .attr('height', height)
                .attr('width', width);

            // define the line
            line = d3.line()
                .x((d: any) => this.xScale(d.x))
                .y(this.yScale(0));

            let data = this.data.get();
            d3G.selectAll<SVGPathElement, number[]>('path')
                .data([data])
                .enter().append<SVGPathElement>('path')
                .attr("class", "line")
                .attr("d", line);

            this.update()

        }

    }

}