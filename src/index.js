import * as d3 from "d3";
import Chartbase from "./chartbase";
import CharteElements from "./chartelements";
import { nest } from "d3-collection";

window.addEventListener("DOMContentLoaded", () => {
  const svg = new Chartbase("#chart");

  Promise.all([
    d3.csv(require("./data/officemeta.csv")),
    d3.csv(require("./data/episodes.csv")),
  ])

    .then(([metaData, episodes]) => {
      let groupedByChar = _groupByChar(episodes, "speaker");
      const characterData = groupedByChar.slice(0, 30);

      console.log(groupedByChar[0].values);
      const groupedByEpisode = _groupByEpisode(groupedByChar[0].values);
      console.log(groupedByEpisode);
      const chart = new CharteElements(svg, metaData, characterData);
    })
    .catch((e) => {
      console.log(e);
    });
});

function getAllSeasons(speakerData) {
  return (
    nest()
      .key(function (d) {
        return d.season;
      })
      .key(function (d) {
        return d.episode;
      })
      // .rollup(function (leaves) {
      //   return leaves.length;
      // })
      .entries(speakerData)
  );
}

function _groupByEpisode(speakerData) {
  return (
    nest()
      // .key(function (d) {
      //   return d.season;
      // })
      .key(function (d) {
        return d.episode;
      })

      .rollup(function (leaves) {
        return leaves.length;
      })
      .entries(speakerData)
  );
  // .sort(function (a, b) {
  //   return d3.ascending(b.values.length, a.values.length);
  // })
}

function _groupByChar(data, prop) {
  const groupedBySpeaker = nest()
    .key(function (d) {
      return d.spkr;
    })

    // .rollup(function (leaves) {
    //   return leaves.length;
    // })
    .entries(data)
    .sort(function (a, b) {
      return d3.ascending(b.values.length, a.values.length);
    });

  return groupedBySpeaker;
}
