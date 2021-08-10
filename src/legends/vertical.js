import * as d3 from "d3";
import {
  chartDimensions,
  margins,
  dimensions,
  radii,
  metalength,
} from "../utils/dimensions";

class VerticalLegends {
  constructor(el) {
    this.svg = el;
    this.legendsGroup;
    this._drawArc = this._drawArc.bind(this);
    this._drawLegend();
    this._drawArc();
  }

  arcGen = d3
    .arc()
    .innerRadius(radii.characterTimelineEnd + 20)
    .outerRadius(radii.characterTimelineEnd + 25)
    .startAngle(dimensions.endAngle)
    .endAngle(2.1 * Math.PI);

  _drawLegend() {
    this.legendsGroup = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          chartDimensions.width / 2 +
          "," +
          chartDimensions.height / 2 +
          ")"
      );
    // this.legendsGroup
    //   .append("line")
    //   .attr("class", "vertical-legend-line")

    //   .attr("x1", 0)
    //   .attr("y1", 0)
    //   .attr("x2", 0)
    //   .attr("y2", -800);
  }

  _drawArc() {
    var angle = d3
      .scaleLinear()
      .domain([0, 49])
      .range([1.96 * Math.PI, 2.045 * Math.PI]);
    var line = d3
      .lineRadial()
      //.interpolate("basis")
      //.tension(0)
      .radius(radii.characterTimelineEnd + 20)
      .angle(function (d, i) {
        return angle(i);
      });

    const l = this.legendsGroup.append("g");

    const titleLabelRad =
      radii.titlesBarStart +
      (radii.titlesBarEnd - radii.titlesBarStart) / 2 -
      33;
    l.append("path")
      .datum(d3.range(50))
      .attr("class", "testarc")
      .attr("d", line.radius(titleLabelRad));

    l.append("text")
      .text("Episodes")
      .attr("x", 0)
      .attr("y", -(titleLabelRad - 3))
      .attr("class", "character-vertical-label");

    const ratingsLabelRad =
      radii.ratingsBarStart +
      (radii.ratingsBarEnd - radii.ratingsBarStart) / 2 -
      33;

    l.append("path")
      .datum(d3.range(50))
      .attr("class", "testarc")
      .attr("d", line.radius(ratingsLabelRad));

    l.append("text")
      .text("IMBD Rating")
      .attr("x", 0)
      .attr("y", -(ratingsLabelRad - 3))
      .attr("class", "character-vertical-label");

    const chars = [
      "Michael",
      "Dwight",
      "Jim",
      "Pam",
      "Andy",
      "Kevin",
      "Angela",
      "Oscar",
      "Erin",
      "Ryan",
      "Darryl",
      "Phyllis",
      "Kelly",
      "Jan",
      "Toby",
      "Stanley",
      "Meredith",
      "Holly",
      "Nellie",
      "Creed",
      "Gabe",
      "Robert",
      "David",
      "Karen",
      "Clark",
      "Roy",
      "Charles",
      "Pete",
      "Jo",
      "Deangelo",
    ];
    for (let i = 0; i < 20; i++) {
      l.append("path")
        .datum(d3.range(50))
        .attr("class", "testarc")
        .attr("d", line.radius(radii.characterTimelineEnd - 30 - i * 20));

      l.append("text")
        .text(chars[i])
        .attr("x", 0)
        .attr("y", -(radii.characterTimelineEnd - 33 - i * 20))
        .attr("class", "character-vertical-label");

      //   l.append("svg:image")
      //     .attr("x", -15)
      //     .attr("y", -(radii.characterTimelineEnd - 15 - i * 20))
      //     .attr("width", 30)
      //     .attr("height", 30)
      //     .attr("xlink:href", require("../assets/michael.jpg"));

      //l.append("line");
      //i = i + 2;
    }
  }
}

export default VerticalLegends;
