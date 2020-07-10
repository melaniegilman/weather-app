const key = "d7de03f041d87b24110dc204b6392170"
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


function getSearchTerm () {
    var searchTerm = document.querySelector('#searchCity').value
        cityList(searchTerm)    
        searchFunction(searchTerm)
}

function cityList (searchTerm) {
    var listItems = document.createElement("li");
    //listItems.classList.add()
    var searchTermText = searchTerm;
    listItems.textContent = searchTermText;
    var historyList = document.querySelector(".history");
    historyList.appendChild(listItems)
    //call searchFunction here
    //searchFunction();
}

function searchFunction () {
    var searchTerm = document.querySelector('#searchCity').value
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=d7de03f041d87b24110dc204b6392170"
    fetch(apiUrl)
        
    .then (function (response) {
        return response.json().then(function(data){
            console.log(data);
        })
    })
    .then(function (searchTerm) {
        var responseCityEl = document.querySelector('#searchCity');
        var search = document.getElementById("#searchCity")
    })
}
    