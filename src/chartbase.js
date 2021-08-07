import * as d3 from "d3";
class Chartbase {
  constructor(id) {
    this.chartSvg;

    this.dimensions = {
      margin: { top: 10, right: 30, bottom: 30, left: 40 },
      width: 1000,
      height: 1000,
    };

    this._buildSVG(id);
    return this.chartSvg;
  }

  _buildSVG = (chartId) => {
    console.log("building");
    this.chartSvg = d3
      .select(chartId)
      .append("svg")
      .attr("width", `${this.dimensions.width} `)
      .attr("height", `${this.dimensions.height}`)
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
