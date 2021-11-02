import * as d3 from "d3";
import { unHighlightRadialBar } from "./radialbars";

export default class Popover {
  constructor(type = 1) {
    this.popover;
    this.type = type;
    this.el = document.querySelector("#popover-" + type);
    this._eventListeners = this._eventListeners.bind(this);
    this._createPopOver();
    this.updateContent = this.updateContent.bind(this);
    this.move = this.move.bind(this);

    this._eventListeners();
    this.timeout;
    return this;
  }

  _eventListeners() {
    this.el.querySelector(".close").addEventListener("click", () => {
      this.hide();
      unHighlightRadialBar();
      setTimeout(() => {
        this.move(0, 0);
      }, 300);
    });

    document.querySelector("body").addEventListener("click", () => {
      unHighlightRadialBar();
      if (this.el.classList.contains("show")) {
        this.el.classList.remove("show");
      }
    });
  }
  _createPopOver() {
    const header = document.createElement("header");
    header.appendChild(document.createElement("h3"));
    const body = document.createElement("section");
    body.classList.add("popup__body");
    if (this.type == 1) {
      header.classList.add("popup-type1");
    }
    // this.el.appendChild(header);
    //this.el.appendChild(body);
  }

  updateContent(title, content) {
    this.el.querySelector("header").innerHTML =
      this.el.querySelector("header") && title;
    this.el.querySelector("section").innerHTML =
      this.el.querySelector("section") && content;
  }

  move(e) {
    const { pageX, pageY, screenX } = e;
    const x = e.screenX > window.innerWidth / 2 ? pageX - 300 : pageX;
    this.el.style.left = x;
    this.el.style.top = pageY;
  }

  show(title, content) {
    this.timeout = setTimeout(() => {
      this.updateContent(title, content);
      this.el.classList.add("show");
    }, 500);
  }
  hide() {
    clearTimeout(this.timeout);
    this.el.classList.remove("show");
  }
}
