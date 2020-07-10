var currentTime = moment().format("dddd MMMM Do YYYY, h:mm a");
var currentTimeInt = moment().hour();

$("#currentDay").text(currentTime);
const currentDay = document.getElementById('currentDay');



// updateTime
function updateTime() {
    const now = moment();
    const humanReadable = now.local().format("dddd, MMMM Do YYYY, h:mm A");
    console.log(humanReadable);
    currentDay.textContent = humanReadable;
}
setInterval(updateTime, 60000);
updateTime();
