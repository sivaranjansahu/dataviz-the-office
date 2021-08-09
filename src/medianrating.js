import * as d3 from "d3";
import { nest } from "d3-collection";
import { chartDimensions, margins, dimensions } from "./utils/dimensions";
import { parseTime } from "./utils/parsers";
import { createXScales, createMedianRatingYScales } from "./scales";

class MedianRating {
  constructor(chartEl, data, options) {
    this.scaleX = createXScales([1, 9]);
    this.scaleY = createMedianRatingYScales([7.7, 8.7]);
    this.svg = chartEl;
    //this.data = data;
    this.data = this._seasonMedianRating(data);
    console.log(this.data);

    this._drawChart = this._drawChart.bind(this);
    this._drawChart();
  }

  _drawChart() {
    const linegroup = this.svg.append("g").attr("class", "median-rating-line ");
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
        return this.scaleX(parseInt(d.key));
      })
      .radius((d) => {
        return this.scaleY(parseFloat(d.value));
      })
      .curve(d3.curveBasis);

    var linePlot = linegroup
      .append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("class", this.classes)
      .attr("d", line);
  }

  _seasonMedianRating(metadata) {
    return nest()
      .key(function (d) {
        return d.Season;
      })

      .rollup(function (leaves) {
        return d3.median(leaves, (d) => parseFloat(d.Ratings));
      })
      .entries(metadata);
  }
}

export default MedianRating;
