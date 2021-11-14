import * as d3 from "d3";
import { nest, entries } from "d3-collection";
import { axisRadialInner } from "d3-radial-axis";
import { createXScales, createYScales } from "./scales";
import {
  chartDimensions,
  dimensions,
  metalength,
  radii,
} from "./utils/dimensions";
import Popover from "./popover";

class Awards {
  constructor(chartEl, data) {
    this.svg = chartEl;
    this.scaleX = createXScales([2006, 2014]);
    this.scaleY = createYScales([6, 10]);
    this.awardPopover = new Popover(3);

    this.data = Array.from(
      d3.group(data, (d) => {
        return parseInt(d.Year);
      })
    );
    //this.data = data;
    console.log(this.data);
    this._drawChart = this._drawChart.bind(this);
    this.createYScales = this._createAxes.bind(this);
    this._eventListeners = this._eventListeners.bind(this);
    this._createAxes();
    this._drawChart();
  }

  _drawChart() {
    const that = this;
    const awardsGroup = this.svg
      .append("g")
      .attr("class", "awards-group")
      .attr(
        "transform",
        "translate(" +
          chartDimensions.width / 2 +
          "," +
          chartDimensions.height / 2 +
          ")"
      );

    const awardYearGroups = awardsGroup
      .selectAll("g.awardyear")
      .data(this.data)
      .enter()
      .append("g")
      .attr("class", "awardyear")
      .attr("data-group-index", (d, i) => i);

    const crcls = awardYearGroups
      .selectAll("circle.award")
      .data((d, i) => {
        //console.log(d3.select(that).attr("data-group-index"));
        //d.year = d[0];
        return d[1];
      })
      .enter()
      .append("circle")
      .attr("class", "award-circle")
      .attr("cx", (d, i) => {
        const startingAngle = this.scaleX(parseInt(d.Year));
        let w =
          (radii.awrdsBarEnd - 30) *
          Math.cos(startingAngle + 0.1 + 0.02 * i - Math.PI / 2);
        //console.log(w);
        return w;
      })
      .attr("cy", (d, i) => {
        const startingAngle = this.scaleX(parseInt(d.Year));
        let h =
          (radii.awrdsBarEnd - 30) *
          Math.sin(startingAngle + 0.1 + 0.02 * i - Math.PI / 2);
        //console.log(w);
        return h;
      })
      .attr("r", (d) => {
        return d.Result == "Won" ? 10 : 2;
      })
      .attr("class", (d) => {
        return d.Result == "Won" ? "award won" : "award nom";
      });

    crcls.call(this._eventListeners);
  }

  _createAxes() {
    const ticksAmount = 30;
    const tickStep = metalength / ticksAmount;
    //const step = Math.ceil(tickStep / 5) * 5;
    const step = 1;

    this.allAxisLinesGroup = this.svg
      .append("g")
      .attr("class", "award-axis-lines")
      .attr(
        "transform",
        "translate(" +
          chartDimensions.width / 2 +
          "," +
          chartDimensions.height / 2 +
          ")"
      );

    this.allAxisLinesGroup
      .append("g")
      .classed("axis", true)
      .call(
        axisRadialInner(this.scaleX, radii.awrdsBarEnd)
          .ticks(ticksAmount)
          .tickFormat(d3.format("d"))
          .tickValues(d3.range(2006, 2014, step))
          //.innerTickSize(2)
          .tickSize(12)
      );
    const that = this;
    d3.selectAll("g.award-axis-lines line").remove();
    d3.selectAll("g.award-axis-lines path").remove();
    d3.selectAll("g.award-axis-lines text")
      //.style("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", 30)
      .attr("class", "yearlabel")
      .attr("transform", function (d) {
        console.log(d);
        return "rotate(" + (that.scaleX(d) * 180) / Math.PI + ")";
      });
  }

  _eventListeners(d) {
    d.on("mouseover", (e, d, i) => {
      e.stopPropagation();

      this.awardPopover.move(e);
      this.awardPopover.show(
        `<h5 class="border-b border-gray-500 pb-2 mb-3 ">${d.Year} ${d.Award}</h5><div class="border-b border-gray-500 pb-2 "><h4  class="font-bold mb-2">${d.Nominee}</h4><span class="bg-purple-400 px-1 rounded text-gray-800">${d.Result}</span></div>`,
        `<p class="py-2">${d.Category}</p>`
      );
    });
    d.on("mouseout", () => {
      this.awardPopover.hide();
    });
  }
}

export default Awards;
