import * as d3 from "d3";
import {
  chartDimensions,
  margins,
  dimensions,
  radii,
  metalength,
} from "./utils/dimensions";
import { parseTime } from "./utils/parsers";
import { createXScales, createYScales } from "./scales";

class RadialBars {
  constructor(chartEl, data, options) {
    this.scaleX = createXScales([0, metalength + 1]);
    this.scaleY = createYScales([6, 10]);
    this.svg = chartEl;
    this.data = data;

    this._handleMouseOver = this._handleMouseOver.bind(this);
    this._handleMouseOut = this._handleMouseOut.bind(this);
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
    var innerRadius = radii.ratingsBarStart,
      outerRadius = radii.ratingsBarEnd;
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
      .attr("id", (d) => {
        return "barchart-" + d.absEpisode;
      })
      .attr("stroke-width", 3)
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

    const titlesGroup = this.radialBarsGroup
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
          "translate(" +
          radii.titlesTextStart +
          ",0)"
        );
      });

    const imdbRatingGroup = this.radialBarsGroup
      .append("g")
      .selectAll("g")
      .data(this.data)
      .enter()
      .append("g")

      .attr("text-anchor", function (d) {
        return (that.scaleX(d.absEpisode) + Math.PI) % (2 * Math.PI) < Math.PI
          ? "middle"
          : "middle";
      })
      .attr("transform", function (d) {
        return (
          "rotate(" +
          ((that.scaleX(d.absEpisode) * 180) / Math.PI - 90) +
          ")" +
          "translate(770,0)"
        );
      });

    imdbRatingGroup
      .append("text")
      .text(function (d) {
        return d.Ratings;
      })
      .attr("id", (d) => "rating-" + d.absEpisode)
      .attr("class", "ratinglabel")
      .attr("transform", function (d) {
        return (that.scaleX(d.absEpisode) + 0.5 * Math.PI) % (2 * Math.PI) <
          Math.PI
          ? "rotate(90)"
          : "rotate(270)";
      })
      .style("font-size", "10px");
    //.attr("alignment-baseline", "middle");

    const titleTexts = titlesGroup
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

    titlesGroup
      .selectAll(".titlelabel text")
      .on("mouseover", this._handleMouseOver)
      .on("mouseout", this._handleMouseOut);
  }
  _handleMouseOver(e, d) {
    document.querySelector("#axisline-" + d.absEpisode).style.stroke = "red";
    document.querySelector("#axisline-" + d.absEpisode).style[
      "stroke-opacity"
    ] = 1;
    document.querySelector("#barchart-" + d.absEpisode).style.stroke = "red";
    document.querySelector("#rating-" + d.absEpisode).style["opacity"] = 1;
  }

  _handleMouseOut(e, d) {
    document.querySelector("#axisline-" + d.absEpisode).style.stroke =
      "#535353";
    document.querySelector("#axisline-" + d.absEpisode).style[
      "stroke-opacity"
    ] = 0.5;
    document.querySelector("#barchart-" + d.absEpisode).style.stroke =
      "#aaaaaa";
    document.querySelector("#rating-" + d.absEpisode).style["opacity"] = 0;
  }
}

export default RadialBars;
