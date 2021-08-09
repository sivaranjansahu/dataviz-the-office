import * as d3 from "d3";
import {
  chartDimensions,
  margins,
  dimensions,
  radii,
  metalength,
} from "./utils/dimensions";
import { parseTime } from "./utils/parsers";
import radialAxis, { axisRadialInner, axisRadialOuter } from "d3-radial-axis";
import RadialAxes from "./radialaxes";
import { createXScales, createYScales } from "./scales";

class RadialLine {
  constructor(chartEl, data, options) {
    this.classes = options.classes || "";
    this.svg = chartEl;
    this.linegroup;
    this.data = data;
    this.scaleX = createXScales([0, metalength]);
    this.scaleY = createYScales([6, 10]);

    this._drawLine = this._drawLine.bind(this);

    this._drawLine();
    const axes = new RadialAxes(this.svg, data, {});
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

    // var linePlot = linegroup
    //   .append("path")
    //   .datum(this.data)
    //   .attr("fill", "none")
    //   .attr("class", this.classes)
    //   .attr("d", line);

    this.linegroup = linegroup;
  }
}

export default RadialLine;
