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

class CharacterLine {
  constructor(chartEl, data, options) {
    this.classes = options.classes || "";
    this.offset = options.offset || 0;
    this.color = options.color || "red";
    this.svg = chartEl;
    this.linegroup;
    this.data = data;
    this.scaleX;
    this.scaleY;

    this._createScales = this._createScales.bind(this);
    this._drawLine = this._drawLine.bind(this);
    this._drawShapes = this._drawShapes.bind(this);

    this.newData = this._padData(this.data);
    this.shapeScaleY = createShapeYScales([0, 200]);
    this._createScales(this.offset);
    this._drawShapes();
    //this._drawLine();

    return this.linegroup;
  }

  _padData() {
    let newData = [];
    for (let i = 0; i < metalength; i++) {
      const found = this.data.find((d) => d.key == i + 1);
      if (found) {
        newData.push(found);
      } else {
        newData.push({
          key: i + 1,
          value: null,
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

    this.scaleY = d3.scaleRadial().range([innerRadius, outerRadius]);

    this.scaleY.domain(
      d3.extent(this.data, function (d) {
        return parseInt(d.value);
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
    shapeGroup
      .selectAll("circle.shape")

      .data(this.newData)

      .enter()
      //.filter((d) => d.value !== null)
      .append("circle")
      .attr("fill", (d) => {
        return parseInt(d.value) > 0 ? this.color : "#fff";
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
        return this.shapeScaleY(parseInt(d.value || 0.5));
      });
  }

  _drawLine() {
    const linegroup = this.svg.append("g").attr("class", "char-line ");
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
        return d.value !== null;
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
      .attr("class", this.classes)
      .attr("d", line);

    this.linegroup = linegroup;
  }
}

export default CharacterLine;
