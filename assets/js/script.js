var cities = JSON.parse(localStorage.getItem("cities")) || [];
const key = "d7de03f041d87b24110dc204b6392170"

//Display date and time
var currentTime = moment().format("dddd MMMM Do YYYY, h:mm a");
var currentTimeInt = moment().hour();
$("#currentDay").text(currentTime);
const currentDay = document.getElementById('currentDay');

// updateTime
function updateTime() {
    const now = moment();
    const humanReadable = now.local().format("dddd, MMMM Do YYYY, h:mm A");
    currentDay.textContent = humanReadable;
}
setInterval(updateTime, 60000);
updateTime();

//for loop for local storage
for (let index = 0; index < cities.length; index++) {
    cityList(cities[index])
};

// reach into the html
// grab the search button
const searchButton = document.querySelector('#searchButton'); // js select
// const searchBtn = $('#searchButton'); // jq select
// listen for a click
// then fire our getSearchTerm function
searchButton.addEventListener('click', getSearchTerm) // js event listener
// searchBtn.on('click', getSearchTerm) // jq event listner
// respective one liners
// document.querySelector('#searchButton').addEventListener('click', getSearchTerm)
// $('#searchButton').on('click', getSearchTerm)

function getSearchTerm() {
    var searchTerm = document.querySelector('#searchCity').value
    cityList(searchTerm)
    searchFunction(searchTerm)
    // var cities = JSON.parse(localStorage.getItem(cities, "#searchCity"));
    // localStorage.setItem(searchTerm, JSON.stringify(cities, "#searchCity"));
}

function cityList(searchTerm) {
    var listItems = document.createElement("button");
    listItems.setAttribute("class", "button");
    listItems.addEventListener('click', function () {
        var searchTool = $(this)[0].innerHTML;
        searchFunction(searchTool);
    })
    //button.addEventListener('click', searchFunction);
    //listItems.classList.add()
    var searchTermText = searchTerm;
    listItems.textContent = searchTermText;
    var historyList = document.querySelector(".history");
    historyList.appendChild(listItems);
    //call searchFunction here
    //searchFunction();
};

var saveCities = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
    event.preventDefault();
};

function searchFunction(searchTerm) {
    //   var searchTerm = document.querySelector('#searchCity').value
    cities.push(searchTerm)
    saveCities();
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=d7de03f041d87b24110dc204b6392170"
    fetch(apiUrl)

        .then(function (response) {
            if (response.ok) {
                var forecastContainer = document.querySelector(".forecast-box")
                var forecastBox = document.querySelector(".results-container")
                forecastContainer.classList.remove("hide")
                forecastBox.classList.remove("hide")
                return response.json().then(function (data) {
                    console.log(data);
                    // --- put this data somewhere on the screen----
                    // get all the data we actually want out of the data obj assign those to variable
                    const cityName = data.name;
                    const dateOfWeather = getLocalDate(data.dt)
                    const humidity = data.main.humidity;
                    const windSpeed = data.wind.speed;
                    const temp = data.main.temp;
                    const icon = data.weather[0].icon;
                    var lat = data.coord.lat
                    var lon = data.coord.lon
                    fetchuvIndex(lat, lon)
                    fetchForecast(searchTerm, dateOfWeather)

                    // grab the area of the html we want to put that data
                    var cityNameHtml = document.querySelector("#cityName");
                    var dateOfWeatherHTML = document.querySelector("#date");
                    var humidityHTML = document.querySelector("#humidity");
                    var windSpeedHTML = document.querySelector("#windSpeed");
                    var tempHTML = document.querySelector("#temp");
                    var convertedTemp = temp * 9 / 5 - 459.67;
                    var iconHTML = document.querySelector("#icon");

                    // plug our data into those areas
                    cityNameHtml.innerHTML = cityName;
                    dateOfWeatherHTML.innerHTML = "(" + dateOfWeather + ")";
                    humidityHTML.innerHTML = "Humidity: " + humidity;
                    windSpeedHTML.innerHTML = "Wind Speed: " + windSpeed + " mph";
                    tempHTML.innerHTML = "Temperature: " + Math.floor(convertedTemp) + "°F";

                    var weatherIconAPI = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                    console.log(weatherIconAPI)
                    iconHTML.setAttribute("src", weatherIconAPI)
                })
            } else {
                alert("Error: " + response.statusText)
            }
        })
}
//retrieve uvIndex and display
var fetchuvIndex = function (lat, lon) {
    var apiUrlIndex = "https://api.openweathermap.org/data/2.5/uvi?appid=7e4c7478cc7ee1e11440bf55a8358ec3&lat=" + lat + "&lon=" + lon;
    //fetch uviIndex
    fetch(apiUrlIndex)
        .then(function (uviResponse) {
            return uviResponse.json().then(function (uviData) {
                console.log(uviData);
                const uvIndex = uviData.value
                var uvIndexDisplay = document.querySelector("#uviLabel");
                uvIndexDisplay.innerHTML = "UV Index = ";
                var uviValue = document.querySelector("#uviValue")
                uviValue.innerHTML = uvIndex
                uviValue.classList.remove("green", "yellow", "orange", "red")
                console.log(uvIndex)
                if (uvIndex <= 3) {
                    uviValue.classList.add("green")
                } else if (uvIndex >= 3 && uvIndex <= 6) {
                    uviValue.classList.add("yellow")
                } else if (uvIndex >= 6 && uvIndex <= 8) {
                    uviValue.classList.add("orange")
                } else {
                    uviValue.classList.add("red")
                }
            })
        })
}

var fetchForecast = function (searchTerm, dateOfWeather) {
    var apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&q=" + searchTerm + "&appid=d7de03f041d87b24110dc204b6392170";
    fetch(apiUrlForecast)
        .then(function (forecastResponse) {
            return forecastResponse.json().then(function (forecastData) {
                console.log(forecastData);
                var forecastArr = []
                for (let index = 1; index < 6; index++) {
                    const date = addDays(dateOfWeather, index).toLocaleDateString();
                    const forecast = forecastData.list.find(forecast => getLocalDate(forecast.dt) === date)
                    forecastArr.push(forecast)
                    console.log(forecast)
                }
                forecastDisplay(forecastArr)
            })
        })
}
var forecastDisplay = function (forecastArr) {
    for (let index = 0; index < 5; index++) {
        const forecast = forecastArr[index];
        const dayEl = document.getElementById("day" + index)
        const humidityEl = document.getElementById("humidity" + index)
        const temperatureEl = document.getElementById("temperature" + index)
        const iconEl = document.getElementById("img" + index)
        console.log("#day" + index)
        var dayName = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { date: 'numeric' })
        var humidity = forecast.main.humidity
        var temperature = forecast.main.temp
        //var iconEl = forecast.weather[0].icon
        dayEl.innerHTML = dayName
        dayEl.classList.add("card-title")
        humidityEl.innerHTML = "Humidity: " + humidity + " %"
        temperatureEl.innerHTML = "Temp: " + temperature

             //forecast icons
        //get icon for current day & display on page
        var iconCode = forecast.weather[0].icon
        var weatherIconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        console.log(weatherIconURL) 
        iconEl.setAttribute("src", weatherIconURL)

    //     var weatherIconAPI = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    //     console.log(weatherIconAPI)
    //    iconEl.setAttribute("src", weatherIconAPI)

    }
}
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function getLocalDate(unixTimeStamp) {
    return new Date(unixTimeStamp * 1000).toLocaleDateString();
}
//searchButton.addEventListener("click", getSearchTerm)