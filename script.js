// Declaring constants for the weather form,
// the cityInput field, the weather card, and
// my api key
const weatherForm = document.querySelector(".weather-form");
const cityInput = document.querySelector(".city-input");
const card = document.querySelector(".weather-card");
const openWeather = window.CONFIG.OPENWEATHER_API_KEY;
// Cancel button functionality
// Getting the cancel button by class name
const cancelBtn = document.querySelector(".btn-cancel");

// when the button is clicked, set the city input value
// to an empty string and hide the card
cancelBtn.addEventListener("click", () => {
  cityInput.value = "";
  card.style.display = "none";
});
// Adding an event listener to the submit button
// on submit, prevent the browser from reloading
// and get the zipcode from the cityInput box
weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  let city = cityInput.value;
  // If there is an input
  if (city) {
    // try to get the weather data for the entered zip code
    // and then display it
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      // otherwise, show the error
      displayError(error);
    }
  } else {
    // if nothing was entered, show a generic error message
    displayError(
      "There was an error processing your request. Please try again later."
    );
  }
});
// async function to get weather data based off of a zip code input
async function getWeatherData(city) {
  // declare apiURL and pass it the city zipcode as well as the api key
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?zip=${city}&appid=${openWeather}`;

  // constant response holds the return from the api call
  const response = await fetch(apiURL);

  // if the response is not ok
  if (!response.ok) {
    // throw an error
    throw new Error("Could not fetch data");
  }
  // otherwise, return response as a json
  return await response.json();
}

// function to display weather info with data as parameter
function displayWeatherInfo(data) {
  // const data contains the desired key : value pairs
  // from the api call. I am deconstructing and retrieving some of the nested
  // values
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  // Simply setting constants to hold each document element
  const cityNameDoc = document.getElementById("cityName");
  const temperatureDoc = document.getElementById("temp");
  const humidityDoc = document.getElementById("humidity");
  const weatherDesc = document.getElementById("weatherDesc");
  // getting the weather icon element, then drilling down
  // to get the span class of the weather icon element.
  const weatherIcon = document.getElementById("weatherIcon");
  const iconSpan = weatherIcon.querySelector("span");

  // When the request is made, capture a timestamp
  document.getElementById("weatherTimeStamp").innerHTML =
    new Date().toLocaleString();

  // Open weather temperature is in Kelvin
  // Formula for conversion:
  // Convert temp °F = (K - 273.15) * 9/5 + 32
  let tempF = (((temp - 273.15) * 9) / 5 + 32).toFixed(1);

  // updating the text content of each field
  cityNameDoc.textContent = city;

  temperatureDoc.textContent = `${tempF}°F`;

  humidityDoc.textContent = "Humidity: " + humidity + "%";
  weatherDesc.textContent = description;
  // Changing the class name of the span icon to the appropriate
  // icon based off of weather ID
  iconSpan.className = getWeatherIcon(id);
}

// This function returns the proper font awesome
// icon based off the current weather ID
function getWeatherIcon(weatherID) {
  switch (true) {
    case weatherID >= 200 && weatherID < 300:
      return "fas fa-bolt";
    case weatherID >= 300 && weatherID < 400:
      return "fas fa-cloud-rain";
    case weatherID >= 500 && weatherID < 600:
      return "fas fa-cloud-showers-heavy";
    case weatherID >= 600 && weatherID < 700:
      return "fas fa-snowflake";
    case weatherID >= 700 && weatherID < 800:
      return "fas fa-smog";
    case weatherID === 800:
      return "fas fa-sun";
    case weatherID > 800:
      return "fas fa-cloud";
    default:
      return "fas fa-cloud";
  }
}

// Function to display errors
function displayError(message) {
  // create an element to hold the error
  const errorDisplay = document.createElement("p");
  // set the text content to be the error message
  errorDisplay.textContent = message;
  // add the styling to the error message
  errorDisplay.classList.add("error-display");
  // clear the card's content
  card.textContent = " ";
  // display flex
  card.style.display = "flex";
  // append the error message
  card.appendChild(errorDisplay);
}

/* -------------------------------------------------------
   Darkmode Toggle
   Credit to: https://www.youtube.com/watch?v=_gKEUYarehE
---------------------------------------------------------- */

// Declaring variable darkMode (gets the 'dark' class in CSS file)
let darkMode = localStorage.getItem("dark");
// Constant changetheme gets the "change-theme" id from the HTML document
const changeTheme = document.getElementById("change-theme");

// This function adds the dark class
// to the HTML body element and saves the
// preference to local storage
const enableDarkMode = () => {
  document.body.classList.add("dark");
  localStorage.setItem("dark", "active");
};

// This function removes the dark class
// to the HTML body element and saves the
// preference to local storage. It reverts to
// the :root color scheme
const disableDarkMode = () => {
  document.body.classList.remove("dark");
  localStorage.setItem("dark", null);
};

// If darkMode is set to active (in local storage)
// and runs the enableDarkMode function
if (darkMode === "active") {
  enableDarkMode();
}
// This adds the click event listener to the "change-theme"
// HTML element
changeTheme.addEventListener("click", () => {
  // Gets darkmode from local storage
  darkMode = localStorage.getItem("dark");
  // if darkmode is not active, enable it on click
  if (darkMode !== "active") {
    enableDarkMode();
  } else {
    // if darkmode is active, enable light mode on click
    disableDarkMode();
  }
});
