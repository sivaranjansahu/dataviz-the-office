import * as d3 from "d3";
import VerticalLegend from "./legends/vertical";
import { createXScales, createYScales } from "./scales";
import {
  chartDimensions,
  dimensions,
  margins,
  metalength,
  radii,
} from "./utils/dimensions";
class Chartbase {
  constructor(id, metaData) {
    this.svgParent;
    this.chartSvg;
    //metaData.push({ absEpisode: "189" });
    this.data = metaData;
    console.log(this.data);
    this._createRayLines = this._createRayLines.bind(this);
    this.scaleX = createXScales([0, metalength + 1]);
    this.scaleY = createYScales([6, 10]);

    this._buildSVG(id);

    this._createRayLines(this.data);
    this._buildArcTitleBg();
    //this._awardCircle();

    return this.chartSvg;
  }

  _buildArcTitleBg() {
    const arc = d3
      .arc()
      .innerRadius(radii.titlesBarStart)
      .outerRadius(radii.titlesBarEnd)
      .startAngle(0)
      .endAngle(dimensions.endAngle);

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
    arcTitleGroup.append("path").attr("class", "titledonut").attr("d", arc);
  }

  _buildSVG(chartId) {
    this.svgParent = d3
      .select(chartId)
      .append("svg")
      .attr("width", `${chartDimensions.width} `)
      .attr("height", `${chartDimensions.height}`);
    this.svgParent
      .append("rect")
      .attr("class", "chart-bg")
      .attr("width", "100%")
      .attr("height", "100%");
    const vertLegend = new VerticalLegend(this.svgParent);
    this.chartSvg = this.svgParent
      .append("g")
      .attr("class", "master-chart-group");
    //.attr("transform", "translate(0,20)");
  }

  _awardCircle() {
    this.chartSvg
      .append("g")
      .attr("class", "award-circle-group")
      .attr(
        "transform",
        "translate(" +
          chartDimensions.width / 2 +
          "," +
          chartDimensions.height / 2 +
          ")"
      )

      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radii.awrdsBarStart)
      .style("fill", "none")
      .style("stroke", "#bababa")
      .style("stroke-width", radii.awrdsBarEnd - radii.awrdsBarStart);
  }

  _createRayLines(metadata) {
    const radius = radii.raylines;
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
