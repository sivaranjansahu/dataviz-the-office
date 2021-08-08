import * as d3 from "d3";
import { chartDimensions, dimensions, margins } from "./utils/dimensions";
class Chartbase {
  constructor(id) {
    this.chartSvg;
    this._buildSVG(id);
    return this.chartSvg;
  }

  _buildSVG = (chartId) => {
    console.log("building");
    this.chartSvg = d3
      .select(chartId)
      .append("svg")
      .attr("width", `${chartDimensions.width} `)
      .attr("height", `${chartDimensions.height}`)
      .append("g")
      .attr("transform", "translate(0,20)");

    this.chartSvg
      .append("rect")
      .attr("class", "chart-bg")
      .attr("width", "100%")
      .attr("height", "100%");
  };
  _createCircles() {}

  _buildYAxis = () => {};
}

export default Chartbase;
