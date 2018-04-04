// https://bl.ocks.org/mbostock/3883245

import {
    Component,
    Input,
    NgZone,
    ElementRef,
    OnInit,
    OnChanges
} from '@angular/core';

import {
    D3Service,
    D3,
    Axis,
    ScaleLinear,
    Selection,
    Transition,
    Line
} from 'd3-ng2-service';

import { ChartService } from '../../services/chart.service';

@Component({
    selector: 'g[app-line-chart]',
    template: '',
    styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnChanges {
    private d3: D3;
    private nativeElement: any;
    private svg: Selection<SVGSVGElement, any, null, undefined>;
    private selector: Selection<SVGGElement, any, null, undefined>;
    private line: Line<any>;
    private xScale: ScaleLinear<number, number>;
    private yScale: ScaleLinear<number, number>;
    private xAxis: Axis<any>;
    private yAxis: Axis<any>;
    private width: number;
    private height: number;
    @Input() data: any;
    @Input() options: any;

    constructor(element: ElementRef, private ngZone: NgZone, _d3Service: D3Service, private service: ChartService) {
        this.d3 = _d3Service.getD3();
        this.nativeElement = element.nativeElement;
        this.svg = this.d3.select(this.nativeElement.parentElement);
        this.selector = this.svg.select<SVGGElement>('g[app-line-chart]');

        this.xScale = this.d3.scaleLinear();
        this.yScale = this.d3.scaleLinear();

        this.xAxis = this.d3.axisBottom<number>(this.xScale).ticks(12);
        this.yAxis = this.d3.axisLeft<number>(this.yScale);

        this.line = this.d3.line()
            .x((d: any) => this.xScale(d.x))
            .y((d: any) => this.yScale(d.y));
    }

    update() {
        if (this.data.length == 0) return
        // console.log('Update line chart')
        let d3 = this.d3;
        let svg = this.svg;
        let selector = this.selector;
        let line: Line<any>;
        let t = svg.transition().duration(this.options.transition.duration);

        let margin = this.options.line.margin || this.options.margin;
        this.width = (this.options.width || +this.svg.attr('width')) - margin.left - margin.right;

        let data = this.options.xDomain ? this.data.filter((d) => (d.x >= this.options.xDomain[0] && d.x < this.options.xDomain[1])) : this.data;
        this.service.update(data);
        this.service.scaleUpdate(this);
        this.service.axisUpdate(this, t);

        let lines = this.selector.select<SVGGElement>('.lines');

        lines.select<SVGGElement>('.overlay')
            .transition(t)
            .attr('width', this.width);

        lines.selectAll<SVGPathElement, number[]>('path')
            .data([data])
            .transition(t)
            .attr("d", this.line);
    }

    ngOnChanges() {
        this.update()
    }

    ngOnInit() {
        if (this.nativeElement !== null) {
            let d3 = this.d3;
            let selector = this.selector;
            let padding = this.options.line.padding || this.options.padding;
            let margin = this.options.line.margin || this.options.margin;
            this.width = (this.options.width || +this.svg.attr('width')) - margin.left - margin.right;
            this.height = (this.options.height || +this.svg.attr('height')) - margin.top - margin.bottom;
            selector.attr('transform', 'translate(' +
                (padding.left + margin.left) + ',' +
                (padding.top + margin.top) + ')')

            let data = this.options.xDomain ? this.data.filter((d) => (d.x >= this.options.xDomain[0] && d.x < this.options.xDomain[1])) : this.data;
            this.service.update(data);
            this.service.scaleUpdate(this);
            this.service.axisInit(this);

            let lines = this.selector.append<SVGGElement>('g')
                .attr('class', 'lines')
                .attr('clip-path', 'url(.lines)');

            lines.append<SVGGElement>('rect')
                .attr('class', 'overlay')
                .attr('width', this.width)
                .attr('height', this.height)
                .style('fill', 'white')
                .style('opacity', 0);

            lines.selectAll<SVGPathElement, number[]>('path')
                .data([data])
                .enter().append<SVGPathElement>('path')
                .attr("class", "line")
                .attr("d", this.line);

            lines.call(this.service.drag(this))
            lines.call(this.service.zoom(this))

            this.service.changed.subscribe(() => this.update())

            this.update()

        }

    }

}
