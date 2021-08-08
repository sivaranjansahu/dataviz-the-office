import * as d3 from "d3";
import { chartDimensions, margins, dimensions } from "./utils/dimensions";
import { parseTime } from "./utils/parsers";
import radialAxis, { axisRadialInner, axisRadialOuter } from "d3-radial-axis";

class RadialLine {
  constructor(chartEl, data, options) {
    this.classes = options.classes || "";
    this.svg = chartEl;
    this.linegroup;
    this.data = data;
    this.scaleX;
    this.scaleY;

    this._createScales = this._createScales.bind(this);
    this._drawLine = this._drawLine.bind(this);

    this._createScales();
    this._drawLine();
    this._createAxes();
    return this.linegroup;
  }

  _drawLine() {
    const linegroup = this.svg.append("g").attr("class", "radial-line ");
    linegroup.attr(
      "transform",
      "translate(" +
        chartDimensions.width / 2 +
        "," +
        chartDimensions.height / 2 +
        ")"
    );

    const line = d3
      .lineRadial()
      .angle((d) => {
        return this.scaleX(parseInt(d.absEpisode));
      })
      .radius((d) => {
        return this.scaleY(d.Ratings);
      })
      .curve(d3.curveBasis);

    var linePlot = linegroup
      .append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("class", this.classes)
      .attr("d", line);

    this.linegroup = linegroup;
  }

  _createAxes() {
    const ticksAmount = 30;
    const tickStep = 186 / ticksAmount;
    const step = Math.ceil(tickStep / 5) * 5;

    this.linegroup
      .append("g")
      .classed("axis", true)
      .call(
        axisRadialInner(this.scaleX, 700)
          .ticks(ticksAmount)
          .tickFormat(d3.format("d"))
          .tickValues(d3.range(0, 186 + step, step))
          //.innerTickSize(-width)
          .tickSize(12)
      );
  }

  _createScales() {
    var innerRadius = 600,
      outerRadius = 700;
    var fullCircle = 1.9 * Math.PI;

    this.scaleX = d3.scaleTime().range([0, fullCircle]);
    this.scaleX.domain(
      [0, 187]
      // d3.extent(this.data, function (d) {
      //   return parseTime(d.Date);
      // })
    );

    this.scaleY = d3.scaleRadial().range([innerRadius, outerRadius]);

    this.scaleY.domain(
      d3.extent(this.data, function (d) {
        return parseFloat(d.Ratings);
      })
    );
  }
}

export default RadialLine;
