import {
    Injectable,
    EventEmitter
} from '@angular/core';
import * as d3 from 'd3';


@Injectable()
export class ChartService {
    public options: any;
    public changed: EventEmitter<any>;

    constructor() {
        this.options = {
            height: 240,
            width: 800,
            axis: 'both',
            transition: { duration: 500. },
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            margin: { top: 20, right: 20, bottom: 30, left: 50 },
            scatter: {
                padding: { top: 250, right: 0, bottom: 0, left: 0 },
            },
            line: {}
        };
        this.changed = new EventEmitter();
    }

    update(data) {
        this.options.xDomain = this.options.xDomain || d3.extent(data, function(d) { return d.x });
        this.options.yDomain = d3.extent(data, function(d) { return d.y });
    }

    scaleUpdate(g) {
        g.xScale.domain(g.options.xDomain).range([0, g.width]);
        g.yScale.domain(g.options.yDomain).range([g.height, 0]);
    }

    axisUpdate(g, t) {
        g.selector.select('.axis--x')
            .transition(t)
            .call(g.xAxis);

        g.selector.select('.axis--y')
            .transition(t)
            .call(g.yAxis);
    }

    axisInit(g) {
        g.yAxis.ticks(12 * g.height / g.width);

        g.selector.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + g.height + ')')
            .call(g.xAxis);

        g.selector.append('g')
            .attr('class', 'axis axis--y')
            .call(g.yAxis);
    }

    drag(g) {
        return d3.drag()
            .on("start", () => {
                g.options.transition.duration = 0;
            })
            .on("drag", () => {
                var xlim0 = g.xScale.domain();
                var xx = xlim0[1] - xlim0[0];
                var xs = g.xScale.range();
                var dx = g.d3.event.dx * xx / (xs[1] - xs[0]);
                g.options.xDomain = [xlim0[0] - dx, xlim0[1] - dx]
                this.changed.emit()
            })
            .on("end", () => {
                g.options.transition.duration = 500;
            })
    }

    zoom(g) {
        return d3.zoom()
            .scaleExtent([1 / 100, 100])
            .translateExtent([[0, 0], [g.width, g.height]])
            .extent([[0, 0], [g.width, g.height]])
            .on("start", () => {
                g.options.transition.duration = 0;
            })
            .on("zoom", () => {
                var t = g.d3.event.transform;
                var xScale = g.d3.scaleLinear().domain([0, g.data.length]).range([0, g.width]);
                g.options.xDomain = t.rescaleX(xScale).domain();
                this.changed.emit()
            })
            .on("end", () => {
                g.options.transition.duration = 500;
            })
    }

}
