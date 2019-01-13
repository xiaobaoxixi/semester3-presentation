"use strict";

class Element {
  constructor(tag, classes, text, parent) {
    this.elem = this.createElement.apply(this, arguments);
    if (parent) {
      this.addToParent(this.elem, parent);
    }
  }
  createElement(tag, classes, text) {
    const elem = document.createElement(tag);
    elem.textContent = text;
    if (classes instanceof Array) {
      for (let i = 0; i < classes.length; i++) {
        elem.classList.add(classes[i]);
      }
    }
    return elem;
  }
  addToParent(elem, parent) {
    parent.appendChild(elem);
  }
}

class Title extends Element {
  constructor(tag, classes, text, parent, listener, action) {
    super(tag, classes, text, parent, listener, action);
    if (listener && Array.isArray(action)) {
      action.forEach(a => {
        this.addListener(this.elem, listener, a);
      });
    }
  }
  addListener(elem, listener, action) {
    elem.addEventListener(listener, e => {
      action(e);
    });
  }
}

function expand(e) {
  document.querySelectorAll(".title").forEach(s => {
    s.classList.remove("brown");
    s.classList.remove("chosen");
  });
  e.target.classList.add("brown");
  e.target.classList.add("chosen");
  document.querySelectorAll(".step").forEach(s => {
    s.classList.remove("expand");
  });
  e.target.parentElement.classList.add("expand");
}

function getText(e) {
  const machingContent = content.filter(c => c.title === e.target.textContent);
  const textS = machingContent[0].text;
  if (document.querySelectorAll(".text")) {
    document.querySelectorAll(".text").forEach(t => {
      t.remove();
    });
  }
  textS.forEach(t => {
    if (t.indexOf("-") < 0) {
      const p = new Element("li", ["text"], t, e.target.parentElement);
    } else {
      const p = new Element("p", ["text"], t, e.target.parentElement);
    }
  });
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
    // build step div upon first appearence, without duplicate step
    if (stepS.indexOf(entry.step) < 0) {
      stepS.push(entry.step);
      const eachStepDiv = new Element(
        "div",
        ["step", "step" + entry.step],
        "",
        base
      );
    }
    // fill in following content for each step
    const stepDiv = document.querySelector(`.step${entry.step}`);
    const eachTitle = new Title(
      entry.tag,
      ["title"],
      entry.title,
      stepDiv,
      "click",
      [expand, getText]
    );
  });
}
