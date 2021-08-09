import * as d3 from "d3";
import { nest, entries } from "d3-collection";
import { axisRadialInner } from "d3-radial-axis";
import { createXScales, createYScales } from "./scales";
import { chartDimensions, dimensions } from "./utils/dimensions";
class RadialAxes {
  constructor(chartEl, data) {
    this.svg = chartEl;
    this.scaleX = createXScales([0, 187]);
    this.scaleY = createYScales([6, 10]);
    this.allAxisLinesGroup;
    this.pieData = this._groupBySeason(data);
    this._createAxes();
    this._createSeasonPie();
    this._createRayLines(data);
  }

  _createAxes() {
    const ticksAmount = 30;
    const tickStep = 186 / ticksAmount;
    const step = Math.ceil(tickStep / 5) * 5;

    this.allAxisLinesGroup = this.svg
      .append("g")
      .attr("class", "all-axis-lines")
      .attr(
        "transform",
        "translate(" +
          chartDimensions.width / 2 +
          "," +
          chartDimensions.height / 2 +
          ")"
      );

    this.allAxisLinesGroup
      .append("g")
      .classed("axis", true)
      .call(
        axisRadialInner(this.scaleX, 700)
          .ticks(ticksAmount)
          .tickFormat(d3.format("d"))
          .tickValues(d3.range(0, 186 + step, step))
          //.innerTickSize(-width)
          .tickSize(12)
      );
  }

  _createSeasonPie() {
    const that = this;
    var pie = d3
      .pie()
      .startAngle(0)
      .endAngle(Math.PI * 1.9)
      .value(function (d) {
        return d.value.value;
      });

    var pieGenerator = d3
      .pie()
      .startAngle(0)
      .padAngle(0.01)
      .endAngle(Math.PI * 1.9)
      .value(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return parseInt(a.value.key) - parseInt(b.value.key);
        //return parseInt(a.value.key).localeCompare(parseInt(b.value.key));
      });

    var data_ready = pieGenerator(this.pieData);
    console.log(pieGenerator(this.pieData));
    var color = d3
      .scaleOrdinal()
      .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
      .range([
        "#eaeaea",
        "#eaeaea",
        "#eaeaea",
        "white",
        "#eaeaea",
        "#eaeaea",
        "#eaeaea",
        "#eaeaea",
        "#eaeaea",
      ]);

    var arcBorder = d3.arc().innerRadius(400).outerRadius(420);
    const arcs = this.allAxisLinesGroup
      .selectAll("whatever")
      .data(data_ready)
      .enter();

    arcs
      .append("path")
      .attr("d", d3.arc().innerRadius(0).outerRadius(400))
      .attr("fill", function (d) {
        return color(parseInt(d.data.key));
      })
      .style("stroke-width", "0px")
      .style("opacity", 0.1);

    arcs
      .append("path")
      .attr("class", "arcborder")
      .attr("fill", "yellow")
      .attr("id", function (d, i) {
        return "arcborder" + i;
      })
      .attr("d", arcBorder)
      .each(function (d, i) {
        //A regular expression that captures all in between the start of a string
        //(denoted by ^) and the first capital letter L
        var firstArcSection = /(^.+?)L/;

        //The [1] gives back the expression between the () (thus not the L as well)
        //which is exactly the arc statement
        var newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
        //Replace all the comma's so that IE can handle it -_-
        //The g after the / is a modifier that "find all matches rather than
        //stopping after the first match"
        newArc = newArc.replace(/,/g, " ");

        //Create a new invisible arc that the text can flow along
        that.allAxisLinesGroup
          .append("path")
          .attr("class", "hiddenDonutArcs")
          .attr("id", "donutArc" + i)
          .attr("d", newArc)
          .style("fill", "none");
      });
    this.allAxisLinesGroup
      .selectAll(".donutText")
      .data([1, 2, 3, 4, 5, 6, 7, 8, 9])
      .enter()
      .append("text")
      .attr("class", "donutText")
      .attr("dy", 13)
      .append("textPath")
      .attr("startOffset", "50%")
      .style("text-anchor", "middle")
      .attr("xlink:href", function (d, i) {
        return "#donutArc" + i;
      })
      .text(function (d) {
        return "Season " + d;
      });
  }

  _createRayLines(metadata) {
    const radius = dimensions.width;
    this.allAxisLinesGroup
      .selectAll("line.rayline")
      .data(metadata)
      .enter()
      .append("line")
      .attr("class", "rayline")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d) => {
        let w =
          radius * Math.cos(this.scaleX(parseInt(d.absEpisode)) - Math.PI / 2);
        //console.log(w);
        return w;
      })
      .attr("y2", (d) => {
        let h =
          radius * Math.sin(this.scaleX(parseInt(d.absEpisode)) - Math.PI / 2);
        //console.log(w);
        return h;
      });
  }

  _groupBySeason(metadata) {
    console.log(metadata);
    return nest()
      .key(function (d) {
        return d.Season;
      })

      .rollup(function (leaves) {
        return leaves.length;
      })
      .entries(metadata);
  }
}

export default RadialAxes;
