let apiKey = "&appid=0112a2612ac390c4e897ee81abe957d7"
let dayStarterURL = "https://api.openweathermap.org/data/2.5/weather?q="
let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
let searchBtn = $(".search_icon");
let currentDay = $("#jumboCD");
let todaysDate = moment().format("dddd, MMMM Do YYYY");
let forecast5 = "";
let cities = ["Charlotte"];
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
        console.log(fiveDayResponse);
        $("#forecast").empty();
       
        for (let i = 0; i < fiveDayResponse.list.length; i++) {
           let curr = fiveDayResponse.list[i];
            if (curr.dt_txt.includes("12:00")) {
                console.log(i);
                console.log(fiveDayResponse.city.name);
               let iconURL = `http://openweathermap.org/img/wn/${fiveDayResponse.list[i].weather[0].icon}@2x.png`
                console.log(iconURL);
               let temp = (fiveDayResponse.list[i].main.temp - 273.15) * 1.80 + 32;
               let tempF = temp.toFixed(1)
               let windSpeed = fiveDayResponse.list[i].wind.speed
               let humidity = fiveDayResponse.list[i].main.humidity
            //    let city = fiveDayResponse.city.name
               let date = moment().add([day], 'day').format('MMMM Do')
                $(".fiveDay").append(`<div class= "col-2 float-left ml-4 bg-warning rounded p-3"> <h4> ${date} </h4> <br> <img src="${iconURL}"> <br> Temp: ${tempF}°F <br> Wind Speed: ${windSpeed} <br>Humidity: ${humidity}% </div>`);
                console.log(tempF);
                console.log(windSpeed);
                console.log(humidity);
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
    console.log("hey");
   let city = $("#city-input").val().trim();
    console.log(city);
    cities.push(city);
    renderDivs();
   let queryURL = dayStarterURL + city + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (search) {
        console.log(search.name);
       let iconURL = "http://openweathermap.org/img/wn/" + search.weather[0].icon + "@2x.png"
       let weatherIcon = $("<img>");
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", "weather icon");
        $("#city").html("<h1>" + search.name + ' : ' + todaysDate + "</h1>");
        $("#city").append(weatherIcon)
       let tempF = (search.main.temp - 273.15) * 1.80 + 32;
        $("#temp").text(tempF.toFixed(1) + " F");
        $("#wind").text("Wind Speed: " + search.wind.speed + " MPH");
        $("#humidity").text("Humidity: " + search.main.humidity + "%");
       
    });
    displayForecast(city);
    keepFive();
});

$(document).on("click", ".city", displayCityBtn);

renderDivs();