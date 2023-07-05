var apiKey = '934752ef31279a3c232101ae35bfa829'
var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}'
//GIVEN a weather dashboard with form inputs
//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
//WHEN I view future weather conditions for that city
//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city

function getWeatherData(city) {
  // Use the Geocoding API to retrieve the coordinates for the city
  var geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  fetch(geocodingUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.length === 0) {
        // No results found for the city
        alert('City not found. Please enter a valid city name.');
        return;
      }

      var lat = data[0].lat;
      var lon = data[0].lon;

      // Use the coordinates to make a request to the 5 Day Weather Forecast API
      var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      fetch(apiUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(weatherData) {
          // Process the weather data and update the dashboard
          // Update current weather display
          updateCurrentWeather(weatherData);

          // Update forecast display
          updateForecast(weatherData);

          // Add the searched city to the search history
          addSearchHistory(city);
        })
        .catch(function(error) {
          console.log('Error retrieving weather data:', error);
        });
    })
    .catch(function(error) {
      console.log('Error retrieving coordinates:', error);
    });
}

function updateCurrentWeather(weatherData) {
  // Get the necessary information from the weatherData object
  var cityName = weatherData.city.name;
  var date = weatherData.list[0].dt_txt;
  var iconCode = weatherData.list[0].weather[0].icon;
  var temperature = weatherData.list[0].main.temp;
  var humidity = weatherData.list[0].main.humidity;
  var windSpeed = weatherData.list[0].wind.speed;

  // Update the current weather display with the retrieved information
  var currentWeatherInfo = document.getElementById('current-weather-info');
  currentWeatherInfo.innerHTML = `
    <p>City: ${cityName}</p>
    <p>Date: ${date}</p>
    <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
    <p>Temperature: ${temperature} K</p>
    <p>Humidity: ${humidity} %</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;
}

function addSearchToHistory(city) {
  // Create a list item element
  var listItem = document.createElement('li');
  listItem.textContent = city;

  // Add a click event listener to the list item
  listItem.addEventListener('click', function() {
    // Call getWeatherData function with the clicked city
    getWeatherData(city);
  });

  // Add the list item to the search history list
  var historyList = document.getElementById('history-list');
  historyList.appendChild(listItem);
}

function updateForecast(weatherData) {
  // Get the forecast information from the weatherData object
  var forecastInfo = weatherData.list;

  // Clear the previous forecast information
  var forecastInfoContainer = document.getElementById('forecast-info');
  forecastInfoContainer.innerHTML = '';

  // Loop through the forecast data and create HTML elements for each day
  for (var i = 0; i < forecastInfo.length; i++) {
    // Extract the necessary information for each day
    var date = forecastInfo[i].dt_txt;
    var iconCode = forecastInfo[i].weather[0].icon;
    var temperature = forecastInfo[i].main.temp;
    var humidity = forecastInfo[i].main.humidity;
    var windSpeed = forecastInfo[i].wind.speed;

    // Create a div element to hold the forecast for the day
    var forecastDiv = document.createElement('div');
    forecastDiv.classList.add('forecast-day');

    // Update the content of the forecast div with the retrieved information
    forecastDiv.innerHTML = `
      <p>Date: ${date}</p>
      <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
      <p>Temperature: ${temperature} K</p>
      <p>Humidity: ${humidity} %</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    // Add the forecast div to the forecastInfoContainer
    forecastInfoContainer.appendChild(forecastDiv);
  }
}
function addSearchHistory(city) {
  // Add the searched city to the search history
  addSearchToHistory(city);
}

// Add an event listener to the form submission event
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Retrieve the value from the city input field
  var cityInput = document.getElementById('city-input');
  var city = cityInput.value.trim();

  // Call the getWeatherData function with the entered city
  getWeatherData(city);

  // Clear the input field
  cityInput.value = '';
});
      
  
  
  
  
  
  
  
  
  
  
  
  
  
  