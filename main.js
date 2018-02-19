const WeatherAPI = (function() {
  const endPoint = "https://fcc-weather-api.glitch.me/api/current";
  function getJSON(url) {
    return fetch(url, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .catch(err => err);
  }
  const getWeather = function(long, lat) {
    const url = `${endPoint}?lon=${long}&lat=${lat}`;
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
    const errorNotif = document.createElement("div");
    errorNotif.className = "is-danger notification";
    errorNotif.style.width = "30%";
    errorNotif.style.display = "block";
    errorNotif.style.margin = "auto";
    errorNotif.style.marginBottom = "0.75rem";
    errorNotif.style.textAlign = "center";
    errorNotif.textContent = message;
    const cont = document.querySelector(".container");
    cont.insertBefore(errorNotif, cont.firstChild);
    setTimeout(() => {
      errorNotif.parentNode.removeChild(errorNotif);
    }, 2500);
  };

  const drawImg = function(src) {
    const imgTag = document.getElementById("weatherImg");
    imgTag.setAttribute("src", src);
  };

  const render = function(state) {
    const weatherPara = document.getElementById("weatherInfo");
    const weatherMin = document.createElement("p");
    const weatherMax = document.createElement("p");
    const location = document.createElement("p");
    const description = document.createElement("p");
    description.className = "subtitle has-text-centered";
    weatherMin.className = "subtitle has-text-centered";
    location.className = "subtitle has-text-centered";
    weatherMax.className = "subtitle has-text-centered";
    weatherMax.innerHTML = `Max: ${state.main.temp_max} °C`;
    weatherMin.innerHTML = `Min: ${state.main.temp_min} °C`;
    location.innerHTML = `${state.name}`;
    description.innerHTML = `${state.weather[0].main}`;
    weatherPara.appendChild(description);
    weatherPara.appendChild(weatherMax);
    weatherPara.appendChild(weatherMin);
    weatherPara.appendChild(location);
    drawImg(state.weather[0].icon);
  };
  return {
    drawError,
    render
  };
})();

const handlers = (function() {
  const getWeather = function(pos) {
    WeatherAPI.getWeather(pos.coords.longitude, pos.coords.latitude)
      .then(res => {
        model.setState(res);
        view.render(model.state);
      })
      .catch(view.drawError);
  };

  const init = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getWeather, err => {
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

document.addEventListener("DOMContentLoaded", () => {
  handlers.init();
});
