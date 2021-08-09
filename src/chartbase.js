import * as d3 from "d3";
import { createXScales, createYScales } from "./scales";
import { chartDimensions, dimensions, margins } from "./utils/dimensions";
class Chartbase {
  constructor(id, metaData) {
    this.chartSvg;
    this.data = metaData;
    this._createRayLines = this._createRayLines.bind(this);
    this.scaleX = createXScales([0, 187]);
    this.scaleY = createYScales([6, 10]);
    this._buildSVG(id);
    this._createRayLines(this.data);
    this._buildArcTitleBg();
    return this.chartSvg;
  }

  _buildArcTitleBg() {
    const arc = d3
      .arc()
      .innerRadius(580)
      .outerRadius(780)
      .startAngle(0)
      .endAngle(1.913 * Math.PI);

    const arcTitleGroup = this.chartSvg
      .append("g")
      .attr("class", "radial-bars")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr(
        "transform",
        "translate(" +
          chartDimensions.width / 2 +
          "," +
          chartDimensions.height / 2 +
          ")"
      );
    arcTitleGroup.append("path").attr("d", arc).attr("fill", "#666");
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
  _createRayLines(metadata) {
    const radius = 800;
    this.chartSvg
      .append("g")
      //.attr("class", "all-axis-lines")
      .attr(
        "transform",
        "translate(" +
          chartDimensions.width / 2 +
          "," +
          chartDimensions.height / 2 +
          ")"
      )
      .selectAll("line.rayline")
      .data(metadata)
      .enter()
      .append("line")
      .attr("class", "rayline")
      .attr("id", (d) => {
        return "axisline-" + d.absEpisode;
      })
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d) => {
        let w =
          radius * Math.cos(this.scaleX(parseInt(d.absEpisode)) - Math.PI / 2);
        //console.log(w);
        return w;
      })
      .attr("y2", (d) => {
        let h =
          radius * Math.sin(this.scaleX(parseInt(d.absEpisode)) - Math.PI / 2);
        //console.log(w);
        return h;
      });
  }

  _buildYAxis = () => {};
}

export default Chartbase;
