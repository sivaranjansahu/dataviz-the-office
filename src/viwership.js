import * as d3 from "d3";
import { chartDimensions, margins, dimensions } from "./utils/dimensions";
import { createXScales, createViewershipYScales } from "./scales";
class ViewershipAreaChart {
  constructor(chartEl, data, options) {
    this.scaleX = createXScales([0, 187]);
    this.scaleY = createViewershipYScales([0, 25]);
    this.svg = chartEl;
    this.data = data;

    this._drawChart = this._drawChart.bind(this);
    this._drawChart();
  }

  _drawChart() {
    var innerRadius = 0,
      outerRadius = 300;
    const that = this;

    const areaGen = d3
      .areaRadial()
      .defined((d) => !!d.Viewership)
      .curve(d3.curveBasis)
      .angle((d) => this.scaleX(d.absEpisode));

    this.viewershipAreaGroup = this.svg
      .append("g")
      .attr("class", "viewership-area-group")
      .attr("width", 300)
      .attr("height", 300)
      .append("g")
      .attr(
        "transform",
        "translate(" +
          chartDimensions.width / 2 +
          "," +
          chartDimensions.height / 2 +
          ")"
      );

    this.viewershipAreaGroup
      .append("path")
      .attr("fill", "lightsteelblue")
      .attr("fill-opacity", 0.2)
      .attr(
        "d",
        areaGen
          .innerRadius(50)
          .outerRadius((d) => this.scaleY(parseFloat(d.Viewership)))(this.data)
      );
  }
}

export default ViewershipAreaChart;
