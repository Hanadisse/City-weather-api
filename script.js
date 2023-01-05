//variables
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
const currentHumidity = document.getElementById("humidity");
const currentTemp = document.getElementById("temperature");
const currentPic = document.getElementById("current-pic");
const currentWind = document.getElementById("wind-speed");
const search = document.getElementById("search-button");
const clear = document.getElementById("clear-history");
const input = document.getElementById("city-input");
const history = document.getElementById("history");
const name = document.getElementById("city-name");
const api = "8cd8a1b346b6a8be26e4c9e39f2b369e";

//  When search button is clicked, read the city name typed by the user
// added the 5 day forecast with the consts
function weatherDashboard(city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      api +
      "&units=imperial"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      name.innerHTML = data.name;
      currentTemp.innerHTML = "Temp: " + Math.floor(data.main.temp) + " &#176F";
      currentHumidity.innerHTML = "Humidity: " + data.main.humidity + "%";
      currentWind.innerHTML =
        "Wind Speed: " + Math.floor(data.wind.speed) + "mph";
      currentPic.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
      );
      currentPic.setAttribute("alt", data.weather[0].description);
      let cityId = data.id;
      fetch(
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
          cityId +
          "&appid=" +
          api
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const forecastCard = document.querySelectorAll(".forecast");
          for (let i = 0; forecastCard.length; i++) {
            forecastCard[i].innerHTML = "";
            const day = i * 8 + 4;
            const forecastDate = new Date(data.list[day].dt * 1000);
            const dateDay = forecastDate.getDate();
            const datemonth = forecastDate.getMonth() + 1;
            const dateyear = forecastDate.getFullYear();
            forecastCard[i].append(datemonth + "/" + dateDay + "/" + dateyear);
            const forecastImg = document.createElement("img");
            forecastImg.setAttribute(
              "src",
              "https://openweathermap.org/img/wn/" +
                data.list[day].weather[0].icon +
                "@2x.png"
            );
            forecastImg.setAttribute(
              "alt",
              data.list[day].weather[0].description
            );
            forecastCard[i].append(forecastImg);
            const forecastTemp = document.createElement("p");
            forecastTemp.innerHTML =
              "Temp: " + Math.floor(data.list[day].main.temp) + " &#176F";
            forecastCard[i].append(forecastTemp);
            const forecastHum = document.createElement("p");
            forecastHum.innerHTML =
              "Hum: " + Math.floor(data.list[day].main.humidity) + "%";
            forecastCard[i].append(forecastHum);
            const forecastWind = document.createElement("p");
            forecastWind.innerHTML =
              "Wind: " + Math.floor(data.list[day].wind.speed) + " mph";
            forecastCard[i].append(forecastWind);
          }
        });
    });
}

// added click function to re click the history tabs
search.addEventListener("click", function () {
  const city = input.value;
  searchHistory.push(city);
  weatherDashboard(city);
  localStorage.setItem("city", JSON.stringify(searchHistory));
  render();
});

// local stoarge 
clear.addEventListener("click", function () {
  searchHistory = [];
  localStorage.clear();
  render();
});

// saves any city searched and could re click to bring it back
function render() {
  history.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    const historyLink = document.createElement("input");
    historyLink.setAttribute("type", "text");
    historyLink.setAttribute("readonly", true);
    historyLink.setAttribute("value", searchHistory[i]);
    // historyLink.addEventListener ("click", weatherDashboard(historyLink))
    history.append(historyLink);
    historyLink.addEventListener("click", function () {
      weatherDashboard(historyLink.value);
    });
  }
}
