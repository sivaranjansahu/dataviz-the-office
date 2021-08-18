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
    this.scaleY = createYScales([7, 10]);
    this.svg = chartEl;
    this.radialBarsGroup;
    this.data = data;
    this.popup = document.querySelector("#popup");
    this._showPopup = this._showPopup.bind(this);
    this._createRatingTicks = this._createRatingTicks.bind(this);
    this._handleMouseOver = this._handleMouseOver.bind(this);
    this._handleMouseOut = this._handleMouseOut.bind(this);
    // this._createGradient();
    this._drawChart = this._drawChart.bind(this);

    document.querySelector("#popup .close").addEventListener("click", () => {
      !this.popup.classList.contains("hidden")
        ? this.popup.classList.add("hidden")
        : null;
    });

    this.color1 = d3
      .scaleLinear()
      .domain([6, 10])
      .range(["#d73027", "#1a9850"])
      .interpolate(d3.interpolateHcl);

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

    this._drawChart();
    this._createRatingTicks();
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

    this.radialBarsGroup

      .selectAll("path")
      .data(this.data)
      .enter()
      .append("path")
      .attr("class", "rating-bar")
      .attr("id", (d) => {
        return "barchart-" + d.absEpisode;
      })
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
          `translate(${radii.titlesBarEnd - 15},0)`
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
        return d.EpisodeTitle.length > 18
          ? d.EpisodeTitle.substring(0, 18) + ".."
          : d.EpisodeTitle;
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
      .on("mouseout", this._handleMouseOut)
      .on("click", this._showPopup);
  }

  _showPopup(e, d) {
    if (!this.popup.classList.contains("hidden")) {
      this.popup.classList.add("hidden");
    } else {
      this.popup.classList.remove("hidden");
      this.popup.querySelector("h3").innerText =
        "S:" + d.Season + "E:" + d.absEpisode;
      this.popup.querySelector("p").innerText = d.About;
      console.log(e.screenX, e.screenY);
      this.popup.style.left =
        e.screenX > window.innerWidth / 2 ? e.pageX - 300 : e.pageX;
      this.popup.style.top =
        e.screenY > window.innerHeight / 2 ? e.screenY - 200 : e.screenY;
    }
  }

  _createRatingTicks() {
    const ratingLablesG = this.radialBarsGroup
      .selectAll("g.ratingaxisG")
      .data([0, 1, 2, 3])
      .enter()
      .append("g")
      .attr("class", "ratingaxisG");

    ratingLablesG
      .append("circle")
      .attr("class", "ratingaxis")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d, i) => {
        return (
          radii.ratingsBarStart +
          (d * (radii.ratingsBarEnd - radii.ratingsBarStart)) / 3
        );
      });

    ratingLablesG
      .append("text")
      .text((d, i) => {
        return d + 7;
      })
      .attr("class", "ratingaxis-tick")

      .attr("x", 0)
      .attr("y", (d, i) => {
        return (
          -radii.ratingsBarStart -
          (d * (radii.ratingsBarEnd - radii.ratingsBarStart)) / 3
        );
      });
  }

  _handleMouseOver(e, d) {
    document.querySelector("#axisline-" + d.absEpisode).style.stroke = "red";
    document.querySelector("#axisline-" + d.absEpisode).style[
      "stroke-opacity"
    ] = 1;
    document.querySelector("#barchart-" + d.absEpisode).style.stroke = "red";
    document.querySelector("#rating-" + d.absEpisode).style["opacity"] = 1;
    //this._setPopup(e, d);
  }
  _setPopup(e, d) {
    this.popup.querySelector("h3").innerText =
      "S:" + d.Season + "E:" + d.absEpisode;
    this.popup.querySelector("p").innerText = d.About;
    this.popup.style.left = e.pageX;
    this.popup.style.top = e.pageY;
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
