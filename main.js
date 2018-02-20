function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function $on(target, type, cb, useCapture) {
  target.addEventListener(type, cb, !!useCapture);
}

function $parent(element, tagName) {
  if (!element.parentNode) {
    return undefined;
  }
  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }

  return $parent(element.parentNode, tagName);
}

const WeatherAPI = (function() {
  const API_KEY = "02c4f393fc03395eb2f52849d3ee647b";
  const endPoint = "https://api.openweathermap.org/data/2.5/weather";
  function getJSON(url) {
    return fetch(url, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .catch(err => err);
  }
  const getWeather = function(lon, lat) {
    const url = `${endPoint}?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`;
    return getJSON(url);
  };
  return {
    getWeather
  };
})();

const model = (function() {
  const state = {};
  const setState = function(weatherObj) {
    model.state = weatherObj;
  };

  return {
    state,
    setState
  };
})();

const view = (function() {
  const drawError = function(message) {
    const errorNotif = `<div class="is-danger notification" style="width: 30%; display: block; margin: auto; margin-bottom: 0.75rem; text-align: center;">${message}</div>`;
    const cont = qs(".container");
    cont.insertAdjacentHTML("afterbegin", errorNotif);
    setTimeout(() => {
      const notif = qs(".notification");
      $parent(notif, "div").removeChild(notif);
    }, 2500);
  };

  const drawSpinner = function() {
    const weatherText = qs("#weatherInfo");
    const spinner = `<span class="has-text-centered loading"><i class="fa fa-spinner fa-spin fa-lg"></i></span>`;
    weatherText.insertAdjacentHTML("beforeend", spinner);
  };

  const clearText = function() {
    qs("#weatherInfo").textContent = "";
  };

  const drawImg = function(src) {
    const imgTag = qs("#weatherImg");
    imgTag.setAttribute("src", `https://openweathermap.org/img/w/${src}.png`);
  };

  const render = function(state) {
    const weatherPara = qs("#weatherInfo");
    const weatherInfo = `<p class="subtitle has-textcentered">${
      state.weather[0].main
    }</p><p class="subtitle has-textcentered">Max: ${
      state.main.temp_max
    } °C</p><p class="subtitle has-textcentered">Min: ${
      state.main.temp_min
    } °C</p><p class="subtitle has-textcentered">${state.name}</p>`;
    weatherPara.insertAdjacentHTML("beforeend", weatherInfo);
    drawImg(state.weather[0].icon);
  };
  return {
    drawError,
    render,
    drawSpinner,
    clearText
  };
})();

const handlers = (function() {
  const getWeather = function(pos) {
    WeatherAPI.getWeather(pos.coords.longitude, pos.coords.latitude)
      .then(res => {
        console.log(res);
        view.clearText();
        model.setState(res);
        view.render(model.state);
      })
      .catch(view.drawError);
  };

  const init = function() {
    if (navigator.geolocation) {
      view.drawSpinner();
      navigator.geolocation.getCurrentPosition(getWeather, err => {
        view.clearText();
        view.drawError(err.message);
      });
    } else {
      view.drawError("Geolocation is not supported on this browser");
    }
  };
  return {
    init
  };
})();

$on(document, "DOMContentLoaded", () => {
  handlers.init();
});
