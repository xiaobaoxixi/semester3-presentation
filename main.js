"use strict";

class Parent {
  constructor(tag, classes, text, parent, listener, action) {
    const elem = document.createElement(tag);
    elem.textContent = text;
    if (classes instanceof Array) {
      for (let i = 0; i < classes.length; i++) {
        elem.classList.add(classes[i]);
      }
    }
    if (parent) {
      this.addToParent(elem, parent);
    }
    if (listener && typeof action === "function") {
      this.addListener(elem, listener, action);
    }
  }
  addToParent(elem, parent) {
    parent.appendChild(elem);
  }
  addListener(elem, listener, action) {
    elem.addEventListener(listener, e => {
      action(e);
    });
  }
}

function expand(e) {
  e.target.className = "expand";
}

// start
let content = [];
const base = document.querySelector("main");

fetch("content.json")
  .then(res => res.json())
  .then(res => {
    content = res;
    build(content);
  });

function build(data) {
  const stepS = [];
  data.forEach(entry => {
    // build step div, without duplicate step value
    if (stepS.indexOf(entry.step) < 0) {
      stepS.push(entry.step);
      const eachStepDiv = new Parent(
        "div",
        ["step", "step" + entry.step],
        "",
        base,
        "click",
        expand
      );
      // fill in first content for each step
      const stepDiv = document.querySelector(`.step${entry.step}`);
      const eachTitle = new Parent(entry.tag, ["title"], entry.title, stepDiv);
    } else {
      // fill in following content for each step
      console.log(entry);
      const stepDiv = document.querySelector(`.step${entry.step}`);
      const eachTitle = new Parent(entry.tag, ["title"], entry.title, stepDiv);
    }
  });
}
