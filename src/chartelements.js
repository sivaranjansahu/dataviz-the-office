import * as d3 from "d3";
import {
  chartDimensions,
  margins,
  dimensions,
  radii,
} from "./utils/dimensions";
import { nest } from "d3-collection";
import RadialLine from "./radialline";
import CharacterLine from "./characterLine";
import RadialBars from "./radialbars";
import Viewership from "./viwership";
import MedianRating from "./medianrating";
import Footer from "./footer";
import Awards from "./awards";
import Popover from "./popover";

class ChartElements {
  constructor(chartEl, metaData, characterData, awardsData) {
    this.svg = chartEl;
    this.data = metaData;
    this.awardsData = awardsData;
    this.characterData = characterData;
    this._drawCircles = this._drawCircles.bind(this);
    //this._drawCircles();
    //this._drawRadialLine();

    this._rad();
  }

  _rad() {
    var color1 = d3
      .scaleSequential()
      .domain([0, 20])
      //.interpolator(d3.interpolateRdYlGn);
      .interpolator(d3.interpolateCool);
    const rad1 = new RadialLine(this.svg, this.data, { classes: "first-line" });
    const awardsEl = new Awards(this.svg, this.awardsData);
    const charList = this.characterData.map((d) => d.key);
    const charToShow = 20;
    const offsetUnit =
      (radii.characterTimelineEnd * 1.1 - radii.characterTimelineStart) /
      charToShow;
    console.log(this.characterData);
    for (let i = 0; i < charToShow; i++) {
      const data = this._characterTotalLinesByEpisode(
        this.characterData[i].values,
        this.characterData[i].key
      );
      data.absEpisode = this.characterData[i].key;
      console.log("radial lines data", data);
      new CharacterLine(this.svg, data, {
        classes: "",
        offset: i * offsetUnit,
        color: color1(i),
        character: "Michael",
      });
    }
    // const mikeData = this._characterTotalLinesByEpisode(
    //   this.characterData[0].values
    // );

    const radialBars = new RadialBars(this.svg, this.data, {});
    const viewershipArea = new Viewership(this.svg, this.data, {});
    const footerData = new Footer(this.svg, this.data);
    // const medianRatingsLine = new MedianRating(this.svg, this.data, {
    //   classes: "median-rating",
    // });
  }
  _createXscale() {}

  _createYScale() {}

  _createXAxis() {}

  _createYAxis() {}

  //** Draw circles */

  _drawCircles = () => {
    var circlesGroup = this.svg.append("g").attr("class", "radial-circles");

    circlesGroup
      .selectAll("circle.radial-circle")
      .data([1, 2, 3])
      .enter()
      .append("circle")
      .attr("class", "radial-circle")
      .attr("cx", chartDimensions.width / 2)
      .attr("cy", chartDimensions.height / 2)
      .attr("r", (d) => d * 100 + "px")
      .style("stroke", "#666")
      .style("fill", "none")
      .style("stroke-width", 1);
  };

  _drawRadialLine = () => {
    var radialLinesGroup = this.svg.append("g").attr("class", "radial-lines");
    radialLinesGroup.attr(
      "transform",
      "translate(" +
        chartDimensions.width / 2 +
        "," +
        chartDimensions.height / 2 +
        ")"
    );

    var parseTime = d3.timeParse("%d-%b-%y");
    var innerRadius = 100,
      outerRadius =
        Math.min(chartDimensions.width, chartDimensions.height) / 2 - 6;
    var fullCircle = 2 * Math.PI;
    var x = d3.scaleTime().range([0, fullCircle]);

    var y = d3.scaleRadial().range([innerRadius, outerRadius]);

    x.domain(
      d3.extent(this.data, function (d) {
        return parseTime(d.Date);
      })
    );
    y.domain(
      d3.extent(this.data, function (d) {
        return d.Close;
      })
    );
    var line = d3
      .lineRadial()
      .angle(function (d) {
        return x(parseTime(d.Date));
      })
      .radius(function (d) {
        return y(d.Close);
      });

    var linePlot = radialLinesGroup
      .append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "#4099ff")
      .attr("d", line);
  };

  _characterTotalLinesByEpisode(speakerData, spkr) {
    return nest()
      .key(function (d) {
        return d.episode;
      })

      .rollup(function (leaves) {
        return {
          lines: leaves.length,
          speaker: spkr,
        };
      })
      .entries(speakerData);
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

export default ChartElements;
