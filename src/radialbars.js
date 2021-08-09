import * as d3 from "d3";
import { chartDimensions, margins, dimensions } from "./utils/dimensions";
import { parseTime } from "./utils/parsers";
import { createXScales, createYScales } from "./scales";

class RadialBars {
  constructor(chartEl, data, options) {
    this.scaleX = createXScales([0, 187]);
    this.scaleY = createYScales([6, 10]);
    this.svg = chartEl;
    this.data = data;
    this._createGradient();
    this._drawChart = this._drawChart.bind(this);

    this.color1 = d3
      .scaleLinear()
      .domain([6, 10])
      .range(["#d73027", "#1a9850"])
      .interpolate(d3.interpolateHcl);

    this._drawChart();
  }

  _createGradient() {
    const that = this;
    const cScale = d3
      .scaleSequential()
      .domain([6, 10])
      .interpolator(d3.interpolateRdYlGn);
    let maingradients = this.svg
      .append("defs")
      .selectAll("linearGradient")
      .data(this.data)
      .enter()
      .append("linearGradient")
      //Create a unique id per "planet"
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
      .attr("y2", "0%")
      //   .attr("gradientTransform", (d) => {
      //     return "rotate(" + (this.scaleX(d.absEpisode) * 180) / Math.PI + ")";
      //   })
      .attr("id", function (d, i) {
        return "gradient-" + i;
      });

    maingradients
      .append("stop")
      .attr("stop-color", function (d) {
        return cScale(0);
      })
      .attr("offset", "0");
    maingradients
      .append("stop")
      .attr("stop-color", function (d) {
        return cScale(parseFloat(d.Ratings));
      })
      .attr("offset", "1");
  }

  _drawChart() {
    var innerRadius = 700,
      outerRadius = 800;
    const that = this;
    this.radialBarsGroup = this.svg
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

    this.radialBarsGroup

      .selectAll("path")
      .data(this.data)
      .enter()
      .append("path")
      .attr("fill", this.color1)
      .attr("stroke", "#aaa")
      //   .style("stroke", function (d, i) {
      //     return "url(#gradient-" + i + ")";
      //   })
      .attr("stroke-width", 4)
      .attr(
        "d",
        d3
          .arc() // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function (d) {
            return that.scaleY(d.Ratings);
          })
          .startAngle(function (d) {
            return that.scaleX(d.absEpisode);
          })
          .endAngle(function (d) {
            return that.scaleX(d.absEpisode);
          })
          .padAngle(0.01)
          .padRadius(innerRadius)
      );

    this.radialBarsGroup
      .append("g")
      .selectAll("g")
      .data(this.data)
      .enter()
      .append("g")
      .attr("class", "titlelabel")
      .attr("text-anchor", function (d) {
        return (that.scaleX(d.absEpisode) + Math.PI) % (2 * Math.PI) < Math.PI
          ? "end"
          : "start";
      })
      .attr("transform", function (d) {
        return (
          "rotate(" +
          ((that.scaleX(d.absEpisode) * 180) / Math.PI - 90) +
          ")" +
          "translate(450,0)"
        );
      })
      .append("text")
      .text(function (d) {
        return d.EpisodeTitle;
      })
      .attr("transform", function (d) {
        return (that.scaleX(d.absEpisode) + Math.PI) % (2 * Math.PI) < Math.PI
          ? "rotate(180)"
          : "rotate(0)";
      })
      .style("font-size", "10px")
      .attr("alignment-baseline", "middle");
  }
}

export default RadialBars;
