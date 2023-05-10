function saveSearch(place) {
  const limit = 5;
  const savedSearch = JSON.parse(localStorage.getItem("search-history")) || [];
  console.log("Current saved search", savedSearch, place);

  if (savedSearch.includes(place)) {
    const newSearchHistory = [
      place,
      ...savedSearch.filter((location) => location !== place),
    ].slice(0, limit);
    localStorage.setItem("search-history", JSON.stringify(newSearchHistory));
  } else {
    const newSearchHistory = [place, ...savedSearch].slice(0, limit);
    localStorage.setItem("search-history", JSON.stringify(newSearchHistory));
  }
}

// read city name from input, get weather data from api, then display
function searchWeatherAndDisplay() {
  const cityInput = document.getElementById("city-input").value;

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=42d98d76405f5b8038f2ad71187af430`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      document.querySelector("#current-weather-data #city-name").innerHTML =
        data.city.name +
        " " +
        new Date(data.list[0].dt_txt).toLocaleDateString("en-US");
      document.querySelector("#current-weather-data #temp").innerHTML =
        "Current Temp (F): " + data.list[0].main.temp.toFixed(1);
      document.querySelector(
        "#current-weather-data #humidity"
      ).innerHTML = `Humidity: ${data.list[0].main.humidity}%`;
      document.querySelector(
        "#current-weather-data #wind-speed"
      ).innerHTML = `Wind speed: ${data.list[0].wind.speed} mph`;

      const weatherIcon = document.createElement("img");
      weatherIcon.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
      const containerIcon = document.querySelector(
        "#current-weather-data #icon"
      );
      containerIcon.innerHTML = "";
      containerIcon.appendChild(weatherIcon);

      // getting index 7, 15, 23, 31, 39
      [1, 2, 3, 4, 5].forEach((idx) => {
        const forecastData = data.list[idx * 8 - 1];
        document.querySelector(`#day${idx} #date${idx}`).innerHTML = new Date(
          forecastData.dt_txt
        ).toLocaleDateString("en-US");

        const forecastWeatherIcon = document.createElement("img");
        forecastWeatherIcon.src = `http://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png`;
        const forecastWeatherIconContainer = document.querySelector(
          `#day${idx} #icon${idx}`
        );
        forecastWeatherIconContainer.innerHTML = "";
        forecastWeatherIconContainer.appendChild(forecastWeatherIcon);

        document.querySelector(`#day${idx} #temp${idx}`).innerHTML =
          "Temp (F): " + forecastData.main.temp.toFixed(1);

        document.querySelector(`#day${idx} #hum${idx}`).innerHTML =
          "Humidity: " + forecastData.main.humidity + "%";
        document.querySelector(`#day${idx} #wind${idx}`).innerHTML =
          "Wind speed: " + forecastData.wind.speed + "mph";
      });
    });
}

const generateHistory = () => {
  const savedSearch = JSON.parse(localStorage.getItem("search-history")) || [];
  const container = document.getElementById("history-container");
  container.innerHTML = "";

  savedSearch.forEach((place) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = place;
    btn.onclick = () => {
      // update the value of text input
      document.getElementById("city-input").value = place;

      // save search
      saveSearch(place);

      // display weather data
      searchWeatherAndDisplay();

      // generate new ordered list of history buttons
      generateHistory();
    };
    container.appendChild(btn);
  });
};

generateHistory();

document.getElementById("search-form").onsubmit = (e) => {
  e.preventDefault();
  searchWeatherAndDisplay();
  saveSearch(document.getElementById("city-input").value);
  generateHistory();
};
