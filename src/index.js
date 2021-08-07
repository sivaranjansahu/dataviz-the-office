import * as d3 from "d3";
import Chartbase from "./chartbase";
import CharteElements from "./chartelements";

window.addEventListener("DOMContentLoaded", () => {
  const svg = new Chartbase("#chart");
  d3.csv(`data/data.csv`)
    .then((data) => {
      const chart = new CharteElements(svg, data);
    })
    .catch((e) => {
      console.log(e);
    });
});
