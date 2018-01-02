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
    private selector: Selection<SVGGElement, any, null, undefined>;
    private d3G: Selection<SVGGElement, any, null, undefined>;
    private xScale: ScaleLinear<number, number>;
    private yScale: ScaleLinear<number, number>;
    private xAxis: Axis<number>;
    private yAxis: Axis<number>;
    @Input() options: any;
    @Input() data;

    constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service) {
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
        this.svg = this.d3.select(this.parentNativeElement.parentElement);
        this.selector = this.svg.select<SVGGElement>('g[app-scatter-chart]');
        this.d3G = this.selector.append<SVGGElement>('g').attr('class', 'dots');
    }

    update() {
        if (this.data.length == 0) return
        console.log('Update scatter chart')
        let d3 = this.d3;
        let svg = this.svg;
        let selector = this.selector;
        let d3G = this.d3G;
        let t: Transition<SVGSVGElement, any, null, undefined>;

        this.xScale.domain(this.options.xDomain);
        this.yScale.domain(this.options.yDomain);

        t = svg.transition().duration(this.options.transition.duration || 500);

        selector.select<SVGGElement>('.axis--x').transition(t).call(this.xAxis);
        selector.select<SVGGElement>('.axis--y').transition(t).call(this.yAxis);

        d3G.selectAll<SVGCircleElement, any>('.dot')
            .data(this.data)
            .exit()
            .transition(t)
            .attr('r', 0).remove();

        d3G.selectAll<SVGCircleElement, [number, number, number]>('.dot')
            .data(this.data)
            .transition(t)
            .attr('cx', (d: any) => this.xScale(d.x))
            .attr('cy', (d: any) => this.yScale(d.y))

        d3G.selectAll<SVGCircleElement, any>('.dot')
            .data(this.data)
            .enter().append<SVGCircleElement>('circle')
            .attr("class", "dot")
            .attr('cx', (d: any) => this.xScale(d.x))
            .attr('cy', (d: any) => this.yScale(d.y))
            .attr('r', 0)
            .transition(t)
            .attr('r', 2.5);
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('Change scatter chart')
        for (let propName in changes) {
            let change = changes[propName];
            let curVal = JSON.stringify(change.currentValue);
            let prevVal = JSON.stringify(change.previousValue);
            if (prevVal == undefined) return
        }
        this.update()
    }

    ngOnInit() {
        console.log('Init scatter chart')
        let self = this;
        let d3 = this.d3;
        let selector = this.selector;
        let d3G = this.d3G;
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
                self.options.xDomain = self.options.xDomain0;
                self.options.yDomain = self.options.yDomain0;
            } else {
                self.options.xDomain = [s[0][0], s[1][0]].map(self.xScale.invert, self.xScale)
                self.options.yDomain = [s[1][1], s[0][1]].map(self.yScale.invert, self.yScale)
                selector.select<SVGGElement>('.brush').call(brush.move, null);
            }
            self.update();

        }

        function idled() {
            idleTimeout = null;
        }

        if (this.parentNativeElement !== null) {
            width = (this.options.width || +this.svg.attr('width')) - margin.left - margin.right;
            height = (this.options.height || +this.svg.attr('height')) - margin.top - margin.bottom;
            selector.attr('transform', 'translate(' +
                (padding.left + margin.left) + ',' +
                (padding.top + margin.top) + ')')

            this.xScale = d3.scaleLinear().domain(this.options.xDomain).range([0, width]);
            this.yScale = d3.scaleLinear().domain(this.options.yDomain).range([height, 0]);

            this.xAxis = d3.axisBottom<number>(this.xScale).ticks(12);
            this.yAxis = d3.axisLeft<number>(this.yScale).ticks(12 * height / width);

            brush = d3.brush().on('end', brushended);
            idleDelay = 350;

            if (this.options.axis == 'bottom' || this.options.axis == 'both') {
                selector.append<SVGGElement>('g')
                    .attr('class', 'axis axis--x')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(this.xAxis);
            }
            if (this.options.axis == 'left' || this.options.axis == 'both') {
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

            d3G.selectAll<SVGCircleElement, any>('circle')
                .data(this.data)
                .enter().append<SVGCircleElement>('circle')
                .attr("class", "dot")
                .attr('cx', (d: any) => this.xScale(d.x))
                .attr('cy', this.yScale(0))
                .attr('r', 2.5);

            this.update()

        }

    }

}
