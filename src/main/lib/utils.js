/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

const loadJson = async (fname) => {
  const url = chrome.runtime.getURL(fname);
  return fetch(url).then((r) => r.json());
};

const updateMap = (map, data) => {
  for (let i = 0; i < data.length; i++) {
    const arr = data[i];
    map.set(arr[0], arr[1]);
  }
};

/**
 * omap({ a: 1, b: 2, c: 3 }, v => v * 2, ["b", "c"]);
 *   -> { a: 1, b: 4, c: 6 }
 */
const omap = (object, func, specifiedProps) => {
  const result = {};
  const props = specifiedProps ?? Object.keys(object);
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    result[prop] = func ? func(object[prop]) : null;
  }
  return result;
};

const areSame = (a, b) => {
  // On the assumption that both have the same properties
  const props = Object.keys(b);
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (a[prop] !== b[prop]) {
      return false;
    }
  }
  return true;
};

const isInsideRange = (range, position) => {
  return (
    position.x >= range.left &&
    position.x <= range.left + range.width &&
    position.y >= range.top &&
    position.y <= range.top + range.height
  );
};

const convertToInt = (str) => {
  let r;
  if (str === null || str === undefined || str === "") {
    r = 0;
  } else {
    r = Number.parseInt(str, 10);
    if (Number.isNaN(r)) {
      r = 0;
    }
  }
  return r;
};

const convertToStyles = (position) => {
  const styles = {};
  const keys = Object.keys(position);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const n = position[key];
    if (Number.isFinite(n)) {
      styles[key] = `${n}px`;
    }
  }
  return styles;
};

const optimizeInitialPosition = (position, minWindowSize = 50, edgeSpace = 5) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return {
    left: clamp(position.left, edgeSpace, windowWidth - position.width - edgeSpace),
    top: clamp(position.top, edgeSpace, windowHeight - position.height - edgeSpace),
    width: clamp(position.width, minWindowSize, windowWidth - edgeSpace * 2),
    height: clamp(position.height, minWindowSize, windowHeight - edgeSpace * 2),
  };
};

const clamp = (value, minValue, maxValue) => {
  let r = value;
  r = min(r, maxValue);
  r = max(r, minValue);
  return r;
};

const max = (a, b) => {
  if (Number.isFinite(a)) {
    return Math.max(a, b);
  }
  return null;
};

const min = (a, b) => {
  if (Number.isFinite(a)) {
    return Math.min(a, b);
  }
  return null;
};

const getSelection = () => {
  const selection = window.getSelection();
  return selection.toString().replace("\r", " ").replace("\n", " ").trim();
};

export default {
  loadJson,
  updateMap,
  omap,
  areSame,
  isInsideRange,
  convertToInt,
  convertToStyles,
  optimizeInitialPosition,
  getSelection,
};
