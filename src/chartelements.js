import * as d3 from "d3";
class ChartElements {
  constructor(chartEl) {
    this.svg = chartEl;

    this.svg
      .append("circle")
      .attr("r", 50)
      .attr("cx", 500)
      .attr("cy", 500)
      .style("fill", "red");
  }

  _createXscale() {}

  _createYScale() {}

  _createXAxis() {}

  _createYAxis() {}
}

export default ChartElements;
