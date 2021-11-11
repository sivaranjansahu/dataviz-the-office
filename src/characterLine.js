import * as d3 from "d3";
import {
  chartDimensions,
  margins,
  dimensions,
  radii,
  metalength,
} from "./utils/dimensions";
import { parseTime } from "./utils/parsers";
import radialAxis, { axisRadialInner, axisRadialOuter } from "d3-radial-axis";
import { createShapeYScales } from "./scales";
import Popover from "./popover";
import { highlightRadialBar, unHighlightRadialBar } from "./radialbars";
import {
  highlighteCharacterLine,
  unHighlighteCharacterLine,
} from "./legends/vertical";

class CharacterLine {
  constructor(chartEl, data, episodeData, options) {
    this.classes = options.classes || "";
    this.offset = options.offset || 0;
    this.color = options.color || "red";
    this.svg = chartEl;
    this.linegroup;
    this.data = data;
    this.scaleX;
    this.scaleY;
    this.episodePopover = new Popover(2);
    this.episodeData = episodeData;
    this._eventListeners = this._eventListeners.bind(this);
    this._createScales = this._createScales.bind(this);
    this._drawLine = this._drawLine.bind(this);
    this._drawShapes = this._drawShapes.bind(this);

    this.newData = this._padData(this.data);
    this.shapeScaleY = createShapeYScales([0, 200]);
    this._createScales(this.offset);
    this._drawShapes();
    //this._drawLine();
    console.log(this.episodeData);
    return this.linegroup;
  }

  _padData() {
    let newData = [];
    for (let i = 0; i < metalength; i++) {
      const found = this.data.find((d) => d.key == i + 1);
      if (found) {
        found.value.episode = "Episode1";
        newData.push(found);
      } else {
        newData.push({
          key: i + 1,
          value: {
            lines: null,
          },
        });
      }
    }
    return newData;
  }

  _createScales(offset) {
    var innerRadius = radii.characterTimelineStart + offset,
      outerRadius = innerRadius + 100;
    var fullCircle = dimensions.endAngle;

    this.scaleX = d3.scaleTime().range([0, fullCircle]);
    this.scaleX.domain(
      [0, metalength + 1]
      // d3.extent(this.data, function (d) {
      //   return parseTime(d.Date);
      // })
    );

    this.scaleY = d3.scaleRadial().range([outerRadius, innerRadius]);

    this.scaleY.domain(
      d3.extent(this.data, function (d) {
        return parseInt(d.value.lines);
      })
    );
  }

  _drawShapes() {
    const shapeGroup = this.svg.append("g").attr("class", "circles ");
    shapeGroup.attr(
      "transform",
      "translate(" +
        chartDimensions.width / 2 +
        "," +
        chartDimensions.height / 2 +
        ")"
    );
    const characterCirclesG = shapeGroup
      .selectAll("circle.shape")

      .data(this.newData)

      .enter();
    //.filter((d) => d.value !== null)

    let crcls = characterCirclesG
      .append("circle")
      .attr("fill", (d) => {
        return parseInt(d.value.lines) > 0 ? this.color : "#666";
      })
      .attr("class", "shape")
      // .attr("cx", (d) => {
      //   return this.scaleX(parseInt(d.key));
      // })
      // .attr("cy", (d) => {
      //   return this.scaleY(d.value);
      // })
      .attr("cx", (d) => {
        let w =
          (radii.characterTimelineEnd - 30 - this.offset) *
          Math.cos(this.scaleX(parseInt(d.key)) - Math.PI / 2);
        //console.log(w);
        return w;
      })
      .attr("cy", (d) => {
        let h =
          (radii.characterTimelineEnd - 30 - this.offset) *
          Math.sin(this.scaleX(parseInt(d.key)) - Math.PI / 2);
        //console.log(w);
        return h;
      })
      .attr("r", (d) => {
        return this.shapeScaleY(parseInt(d.value.lines || 0.5));
      });
    crcls.call(this._eventListeners);

    //crcls.selectAll("circle").on("mouseover", this._eventListeners);
  }

  _eventListeners(d) {
    d.on("mouseover", (e, d, i) => {
      console.log(this.episodeData, d.key);
      setTimeout(() => {
        const thisEpisode = this.episodeData.find(
          (d) => parseInt(d.absEpisode) == d.key
        );
        console.log(thisEpisode);
      }, 0);

      // console.log(
      //   this.data.episodeData.find((d) => parseInt(d.absEpisode) == 8)
      // );
      this.episodePopover.move(e);
      this.episodePopover.show(
        `<div class="border-b border-gray-500 pb-2 "><h4  class="font-bold mb-2">Screen time of  ${d.value.speaker}</h4></div>`,
        `<p class="py-2">${d.value.lines / 2}%</p>`
      );
      highlightRadialBar(d.key);
      highlighteCharacterLine(d.value.speaker.toLowerCase());

      document
        .querySelector(
          "#character-vertical-label-" + d.value.speaker.toLowerCase()
        )
        .classList.add("highlighted");
    });
    d.on("mouseout", (e, d, i) => {
      this.episodePopover.hide();
      unHighlightRadialBar();
      unHighlighteCharacterLine();
      document
        .querySelector("[id^=character-vertical-label-].highlighted")
        .classList.remove("highlighted");
    });
  }

  _drawLine() {
    const linegroup = this.svg.append("g").attr("class", "char-line ");
    console.log(this.newData);
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
      .defined(function (d) {
        return d.value.lines !== null;
      })

      .angle((d) => {
        return this.scaleX(parseInt(d.key));
      })
      .radius((d) => {
        //return this.scaleY(d.value);
        return this.scaleY(0);
      })

      .curve(d3.curveBasis);

    var linePlot = linegroup
      .append("path")
      .datum(this.newData)
      .attr("fill", "none")
      .attr("stroke", this.color)
      .attr("stroke-width", 5)
      .attr("stroke-linecap", "round")
      .attr("class", this.classes)
      .attr("d", line);

    this.linegroup = linegroup;
  }
}

export default CharacterLine;
