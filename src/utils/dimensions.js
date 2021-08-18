export const margins = { top: 20, right: 10, bottom: 20, left: 10 };
export const dimensions = {
  width: 1960,
  height: 1960,
  endAngle: 1.913 * Math.PI,
};

export const chartDimensions = {
  width: dimensions.width - margins.left - margins.right,
  height: dimensions.height - margins.top - margins.bottom,
};

export const r = dimensions.width * 0.000510204; // = 1/1960 - to make chart responsive
export const radii = {
  viewershipStart: r * 50,
  viewershipEnd: r * 250,
  characterTimelineStart: r * 200,
  characterTimelineEnd: r * 600,
  awrdsBarStart: r * 660,
  awrdsBarEnd: r * 690,
  titlesBarStart: r * 625,
  titlesBarEnd: r * 810,
  titlesTextStart: r * 690,
  ratingsBarStart: r * 820,
  ratingsBarEnd: r * 920,

  raylines: r * 860,
  medianRatingEnd: r * 200,
  absEpisode: r * 880,
};

export const bgcolors = {
  viewership: "#ccc",
  characterTimeline: "#666",
  core: "#333",
  seasonLabels: "#fb1",
  titlesBar: "#bbb",
  ratingsBar: "#aaa",
};

export const metalength = 188;
