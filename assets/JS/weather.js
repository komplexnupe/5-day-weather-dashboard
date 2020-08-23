let apiKey = "&appid=0112a2612ac390c4e897ee81abe957d7"
let dayStarterURL = "https://api.openweathermap.org/data/2.5/weather?q="
let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
let uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?"
let searchBtn = $(".search_icon");
let currentDay = $("#jumboCD");
let todaysDate = moment().format("dddd, MMMM Do YYYY");
let forecast5 = "";
let cities = [];
let day = 0

function keepFive(){
    if(cities.length === 5){
        cities.splice(0,1);
    }
}

// Display Current Day on Jumbotron
function displayCityBtn() {
   let city = $(this).attr("data-city");
   let queryURL = dayStarterURL + city + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.weather[0].icon);
       let iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
       let weatherIcon = $("<img>");
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", "weather icon");
        $("#city").html("<h1>" + response.name + ' : ' + todaysDate + "</h1>").attr("style", "color:white");
        $("#city").append(weatherIcon)
       let tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $("#temp").text(tempF.toFixed(1) + " F");
        $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");


        displayForecast(city)
    });
}

// Display 5 Day Forecast
function displayForecast(city) {
   let queryURL = forecastURL + city + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (fiveDayResponse) {
        $("#forecast").empty();
       
        for (let i = 0; i < fiveDayResponse.list.length; i++) {
           let curr = fiveDayResponse.list[i];
            if (curr.dt_txt.includes("12:00")) {
                // console.log(i);
                // console.log(fiveDayResponse.city.name);
               let iconURL = `http://openweathermap.org/img/wn/${fiveDayResponse.list[i].weather[0].icon}@2x.png`
               let temp = (fiveDayResponse.list[i].main.temp - 273.15) * 1.80 + 32;
               let tempF = temp.toFixed(1)
               let windSpeed = fiveDayResponse.list[i].wind.speed
               let humidity = fiveDayResponse.list[i].main.humidity
               let date = moment().add([day], 'day').format('MMMM Do')
                $(".fiveDay").append(`<div class= "col-2 float-left ml-4 bg-warning rounded p-3"> <h4> ${date} </h4> <br> <img src="${iconURL}"> <br> Temp: ${tempF}°F <br> Wind Speed: ${windSpeed} <br>Humidity: ${humidity}% </div>`);
                day++
            }
        }
    });
}

// Create Button Divs for City History
function renderDivs() {
    $("#cities-view").empty();

    for (let i = 0; i < cities.length; i++) {
       let newCity = $("<button>");
        newCity.addClass("btn btn-dark w-100 mb-1 city");
        newCity.attr("data-city", cities[i]);
        newCity.text(cities[i]);
        $("#cities-view").append(newCity);
    }
}

// Search Button function
$(searchBtn).on("click", function (event) {
    event.preventDefault();
   let city = $("#city-input").val().trim();
   if(city === ""){
       $("#cities-form").append(`<div class= "text-danger bg-light"><p>Please Enter City Name</p></div>`)
       return;
   } else {
       $(".text-danger").addClass("d-none");
    cities.push(city);
    renderDivs();
   let queryURL = dayStarterURL + city + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (searchResponse) {
        localStorage.setItem("SearchCity", searchResponse.name)
        localStorage.setItem("lat", searchResponse.coord.lat);
        localStorage.setItem("lon", searchResponse.coord.lon);
       let iconURL = "http://openweathermap.org/img/wn/" + searchResponse.weather[0].icon + "@2x.png"
       let weatherIcon = $("<img>");
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", "weather icon");
        $("#city").html("<h1>" + searchResponse.name + ' : ' + todaysDate + "</h1>");
        $("#city").append(weatherIcon)
       let tempF = (searchResponse.main.temp - 273.15) * 1.80 + 32;
        $("#temp").text(tempF.toFixed(1) + " °F");
        $("#wind").text("Wind Speed: " + searchResponse.wind.speed + " MPH");
        $("#humidity").text("Humidity: " + searchResponse.main.humidity + "%");
       
        uv();
     });
    displayForecast(city);
    keepFive();
}});

// Search by Saved History Button
$(document).on("click", ".city", displayCityBtn);

// Search on Enter Keypress
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        // alert("You pressed Enter");
        e.preventDefault();
       $(searchBtn).click();
    }
});

$(document).ready(function() {
    // console.log("ready!" );
let lastSearched = localStorage.getItem("SearchCity");
// console.log(lastSearched);
let queryURL = dayStarterURL + lastSearched + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (loadResponse) {
       let iconURL = `http://openweathermap.org/img/wn/${loadResponse.weather[0].icon}@2x.png`
       let weatherIcon = $("<img>");
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", "weather icon");
        $("#city").html(`<h1>${lastSearched} : ${todaysDate}</h1>`);
        $("#city").append(weatherIcon)
       let tempF = (loadResponse.main.temp - 273.15) * 1.80 + 32;
        $("#temp").text(`${tempF.toFixed(1)} °F`);
        $("#wind").text(`Wind Speed: ${loadResponse.wind.speed} MPH`);
        $("#humidity").text(`Humidity: ${loadResponse.main.humidity}%`);
       
    });
    displayForecast(lastSearched);
    uv();
});

function uv(){
    let lat = localStorage.getItem("lat");
    let lon = localStorage.getItem('lon');
    let queryURL = `${uvIndexURL}${apiKey}&lat=${lat}&lon=${lon}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (uvResponse) {
        let uvIndex = uvResponse.value;
      console.log(uvIndex);
      if(uvResponse.value < 3){
          $("#uv").addClass("uvGreen")
      } else if(uvResponse.value >= 3 && uvResponse.value < 6){
        $("#uv").addClass("uvYellow")
      }else if(uvResponse.value >= 6 && uvResponse.value < 8){
        $("#uv").addClass("uvOrange")
      }else if(uvResponse.value >= 8 && uvResponse.value < 11){
        $("#uv").addClass("uvRed")
      }else if(uvResponse.value >= 11){
        $("#uv").addClass("uvPurple")
      };
      $("#uv").text(`UV Index: ${uvIndex}`)
    });

}

renderDivs();