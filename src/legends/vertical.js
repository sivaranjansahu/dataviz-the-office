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
    this._textBg();
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
      .range([1.965 * Math.PI, 2.04 * Math.PI]);
    var line = d3
      .lineRadial()
      //.interpolate("basis")
      //.tension(0)
      .radius(radii.characterTimelineEnd + 20)
      .angle(function (d, i) {
        return angle(i);
      });

    const l = this.legendsGroup.append("g");
    l.attr("class", "wedge-headers-group");
    const titleLabelRad =
      radii.titlesBarStart +
      (radii.titlesBarEnd - radii.titlesBarStart) / 2 +
      20;
    l.append("path")
      .datum(d3.range(50))
      .attr("class", "testarc")
      .attr("d", line.radius(titleLabelRad));

    l.append("text")
      .text("Episodes")
      .attr("class", "wedge-title")
      .attr("x", 0)
      .attr("y", -(titleLabelRad - 3))
      .attr("class", "character-vertical-label vertical-header");

    const awardsLabelRad =
      radii.awrdsBarStart +
      (radii.awrdsBarEnd - radii.awrdsBarStart) / 2 -
      33 +
      16;
    l.append("path")
      .datum(d3.range(50))
      .attr("class", "testarc")
      .attr("d", line.radius(awardsLabelRad));

    l.append("text")
      .text("Awards")
      .attr("class", "wedge-title")
      .attr("x", 0)
      .attr("y", -(awardsLabelRad - 3))
      .attr("class", "character-vertical-label vertical-header");

    const screnTimeLabelRad = radii.characterTimelineEnd + 10;
    const screenTimeGroup = l
      .append("g")
      .attr("id", "downarrow")
      .attr("transform", "translate(-10," + (-screnTimeLabelRad + 10) + ")");

    l.append("text")
      .text("Screen time")
      .attr("class", "wedge-title")
      .attr("x", 0)
      .attr("y", -screnTimeLabelRad + 10)
      .attr("class", "character-vertical-label vertical-header");
    l.append("line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", -screnTimeLabelRad + 15)
      .attr("y2", -screnTimeLabelRad + 37)
      .attr("class", "screentime-connector");

    // d3.xml(require("../assets/arrow-down.svg")).then((data) => {
    //   screenTimeGroup.node().append(data.documentElement);
    // });
    const ratingsLabelRad =
      radii.ratingsBarStart + (radii.ratingsBarEnd - radii.ratingsBarStart) / 2;

    l.append("path")
      .datum(d3.range(50))
      .attr("class", "testarc")
      .attr("d", line.radius(ratingsLabelRad));

    l.append("text")
      .text("IMBD Rating")
      .attr("class", "wedge-title")
      .attr("x", 0)
      .attr("y", -(ratingsLabelRad - 3))
      .attr("class", "character-vertical-label vertical-header");

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
    let chTitles = l.append("g").attr("class", "character-titles-group");
    for (let i = 0; i < 20; i++) {
      chTitles
        .append("path")
        .datum(d3.range(50))
        .attr("class", "testarc")
        .attr("d", line.radius(radii.characterTimelineEnd - 30 - i * 25));

      if (false) {
        l.append("svg:image")
          .attr("x", -10)
          .attr("y", -(radii.characterTimelineEnd - 10 - i * 20))
          .attr("width", 30)
          .attr("height", 30)
          .attr("class", "avatar")
          .attr("xlink:href", require("../assets/michael.jpg"));
      } else {
        l.append("text")
          .text(chars[i])
          .attr("x", 0)
          .attr("y", -(radii.characterTimelineEnd - 33 - i * 25))
          .attr("class", "character-vertical-label");
      }

      // l.selectAll("image").on("mouseover", (e, d) => {
      //   this.attr("transform", "scale(2");
      // });

      //l.append("line");
      //i = i + 2;
    }
  }

  _textBg() {
    const ctx = document.querySelector(".wedge-headers-group");
    const charGroupCtx = document.querySelector(".character-titles-group");

    //   textElm = ctx.querySelector(".vertical-header"),
    //   SVGRect = textElm.getBBox();

    // var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    // rect.setAttribute("x", SVGRect.x - 5);
    // rect.setAttribute("y", SVGRect.y - 2.5);
    // rect.setAttribute("width", SVGRect.width + 10);
    // rect.setAttribute("height", SVGRect.height + 5);
    // rect.setAttribute("fill", "yellow");
    // ctx.insertBefore(rect, textElm);

    document
      .querySelectorAll(".vertical-header,.character-vertical-label")
      .forEach((d, i) => {
        const textElm = d;
        const SVGRect = textElm.getBBox();

        var rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", SVGRect.x - 5);
        rect.setAttribute("y", SVGRect.y - 2.5);
        rect.setAttribute("width", SVGRect.width + 10);
        rect.setAttribute("height", SVGRect.height + 5);
        rect.setAttribute("class", "text-label-bg");
        ctx.insertBefore(rect, textElm);
      });
  }
}

export default VerticalLegends;
