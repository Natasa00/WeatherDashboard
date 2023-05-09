document.getElementById("search-form").onsubmit = (e) => {
  e.preventDefault();
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
      document
        .querySelector("#current-weather-data #icon")
        .appendChild(weatherIcon);

      // getting index 7, 15, 23, 31, 39
      [1, 2, 3, 4, 5].forEach((idx) => {
        const forecastData = data.list[idx * 8 - 1];
        document.querySelector(`#day${idx} #date${idx}`).innerHTML = new Date(
          forecastData.dt_txt
        ).toLocaleDateString("en-US");

        const forecastWeatherIcon = document.createElement("img");
        forecastWeatherIcon.src = `http://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png`;
        document
          .querySelector(`#day${idx} #icon${idx}`)
          .appendChild(forecastWeatherIcon);

        document.querySelector(`#day${idx} #temp${idx}`).innerHTML =
          "Temp (F): " + forecastData.main.temp.toFixed(1);

        document.querySelector(`#day${idx} #hum${idx}`).innerHTML =
          "Humidity: " + forecastData.main.humidity + "%";
        document.querySelector(`#day${idx} #wind${idx}`).innerHTML =
          "Wind speed: " + forecastData.wind.speed + "mph";
      });
    });
};
