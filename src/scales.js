import * as d3 from "d3";
import { radii, dimensions } from "./utils/dimensions";
const innerRadius = radii.ratingsBarStart,
  outerRadius = radii.ratingsBarEnd;
const fullCircle = dimensions.endAngle;

export function createXScales(xExtent) {
  const scaleX = d3.scaleLinear().range([0, fullCircle]);
  scaleX.domain(xExtent);
  return scaleX;
}

export function createYScales(yExtent) {
  const scaleY = d3.scaleRadial().range([innerRadius, outerRadius]);

  scaleY.domain(yExtent);
  return scaleY;
}

export function createViewershipYScales(yExtent) {
  var innerRadius = 0,
    outerRadius = radii.viewershipEnd;
  const scaleY = d3.scaleRadial().range([innerRadius, outerRadius]);

  scaleY.domain(yExtent);
  return scaleY;
}

export function createMedianRatingYScales(yExtent) {
  var innerRadius = 0,
    outerRadius = radii.medianRatingEnd;
  const scaleY = d3.scaleRadial().range([innerRadius, outerRadius]);

  scaleY.domain(yExtent);
  return scaleY;
}

export function createShapeYScales(yExtent) {
  return d3.scaleLinear().range([1, 16]).domain(yExtent);
}
