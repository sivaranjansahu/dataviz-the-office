import * as d3 from "d3";
const innerRadius = 800,
  outerRadius = 900;
const fullCircle = 1.9 * Math.PI;

export function createXScales(xExtent) {
  const scaleX = d3.scaleLinear().range([0, fullCircle]);
  scaleX.domain(xExtent);
  return scaleX;
}

export function createYScales(yExtent) {
  var fullCircle = 1.9 * Math.PI;
  const scaleY = d3.scaleRadial().range([innerRadius, outerRadius]);

  scaleY.domain(yExtent);
  return scaleY;
}

export function createViewershipYScales(yExtent) {
  var innerRadius = 0,
    outerRadius = 300;
  var fullCircle = 1.9 * Math.PI;
  const scaleY = d3.scaleRadial().range([innerRadius, outerRadius]);

  scaleY.domain(yExtent);
  return scaleY;
}

export function createMedianRatingYScales(yExtent) {
  var innerRadius = 0,
    outerRadius = 200;
  var fullCircle = 1.9 * Math.PI;
  const scaleY = d3.scaleRadial().range([innerRadius, outerRadius]);

  scaleY.domain(yExtent);
  return scaleY;
}
