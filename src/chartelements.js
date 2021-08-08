import * as d3 from "d3";
import { chartDimensions, margins, dimensions } from "./utils/dimensions";
import { nest } from "d3-collection";
import RadialLine from "./radialline";
import CharacterLine from "./characterLine";
class ChartElements {
  constructor(chartEl, metaData, characterData) {
    this.svg = chartEl;
    this.data = metaData;
    this.characterData = characterData;
    this._drawCircles = this._drawCircles.bind(this);
    this._drawCircles();
    //this._drawRadialLine();
    this._rad();
  }

  _rad() {
    console.log(this.characterData);
    const rad1 = new RadialLine(this.svg, this.data, { classes: "first-line" });
    const mikeData = this._characterTotalLinesByEpisode(
      this.characterData[0].values
    );
    const hollyData = this._characterTotalLinesByEpisode(
      this.characterData[17].values
    );
    console.log(hollyData);
    const michael = new CharacterLine(this.svg, mikeData, {
      classes: "first-line",
    });
    const holly = new CharacterLine(this.svg, hollyData, {
      classes: "second-line",
    });
    const toby = new CharacterLine(
      this.svg,
      this._characterTotalLinesByEpisode(this.characterData[2].values),
      {
        classes: "third-line",
      }
    );
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

  _characterTotalLinesByEpisode(speakerData) {
    return nest()
      .key(function (d) {
        return d.episode;
      })

      .rollup(function (leaves) {
        return leaves.length;
      })
      .entries(speakerData);
  }
}

export default ChartElements;
