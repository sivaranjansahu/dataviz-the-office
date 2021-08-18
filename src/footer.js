import * as d3 from "d3";
import { nest } from "d3-collection";
import {
  chartDimensions,
  margins,
  dimensions,
  radii,
  metalength,
} from "./utils/dimensions";
import { parseTime } from "./utils/parsers";
import { createXScales, createYScales } from "./scales";

export default class Footer {
  constructor(el, data) {
    this.data = data;
    this._buildTopEpisode();
    this._buildTopDirectors();
    this._buildTopWriters();
  }
  _buildTopDirectors() {
    let byDirectors = nest()
      .key(function (d) {
        return d.Director;
      })

      .rollup(function (leaves) {
        return {
          median: d3.median(leaves, (d) => parseFloat(d.Ratings)),
          episodes: leaves,
        };
      })
      .entries(this.data);
    byDirectors.sort(
      (a, b) =>
        +b.value.median * b.value.episodes.length -
        +a.value.median * a.value.episodes.length
    );

    byDirectors = byDirectors.filter((d) => d.key !== "See full summary");
    console.log(byDirectors);
    byDirectors = byDirectors.slice(0, 10);
    d3.select("#top-directors ul")
      .selectAll("li")
      .data(byDirectors)
      .enter()
      .append("li")
      .html(function (d) {
        return `<li class="grid mb-5"  style="grid-template-columns:3fr 2fr 1fr">
        <h3 >${d.key}</h3>
        
        <div>${d.value.episodes.length} Episodes</div>
        
        <span class="text-right" >${d.value.median}</span>
        </li>`;
      });
  }

  _buildTopWriters() {
    let byWriter = nest()
      .key(function (d) {
        return d.Writers.split("|")[0];
      })

      .rollup(function (leaves) {
        return {
          median: d3.median(leaves, (d) => parseFloat(d.Ratings)),
          episodes: leaves,
        };
      })
      .entries(this.data);

    byWriter.sort(
      (a, b) =>
        +b.value.median * b.value.episodes.length -
        +a.value.median * a.value.episodes.length
    );

    //byWriter = byWriter.filter((d) => d.key !== "See full summary");
    console.log(byWriter);
    byWriter = byWriter.slice(0, 10);
    console.log(byWriter);

    var p = d3
      .select("#top-writers ul")
      .selectAll("li")
      .data(byWriter)
      .enter()
      .append("li")
      .html(function (d) {
        return `<li class="grid mb-5" style="grid-template-columns:3fr 2fr 1fr">
        <h3 >${d.key}</h3>
        
        <div>${d.value.episodes.length} Episodes</div>
        
        <span class="text-right" >${d.value.median}</span>
        </li>`;
      });
  }
  _buildTopEpisode() {
    const topData = this.data
      .sort(function (a, b) {
        return d3.descending(+a.Ratings, +b.Ratings);
      })
      .slice(0, 10); //top 10 here

    var p = d3
      .select("#top-episodes ul")
      .selectAll("li")
      .data(topData)
      .enter()
      .append("li")
      .html(function (d) {
        return `<li class="grid mb-5"  style="grid-template-columns:3fr 2fr 1fr">
        <h3 >${d.EpisodeTitle}</h3>
        
        <div>S${d.Season} E${d.seasonEpisode} </div>
        
        <span class="text-right" >${d.Ratings}</span>
        </li>`;
      });
  }
}
