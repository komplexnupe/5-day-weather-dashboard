var apiKey = "&appid=0112a2612ac390c4e897ee81abe957d7"
var dayStarterURL = "https://api.openweathermap.org/data/2.5/weather?q="
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var searchBtn = $(".search_icon");
var currentDay = $("#jumboCD");
var todaysDate = moment().format("dddd, MMMM Do YYYY");
var forecast5 = "";
var cities = ["Charlotte"];

// Display Current Day on Jumbotron
function displayCityBtn() {
    var city = $(this).attr("data-city");
    var queryURL = dayStarterURL + city + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.weather[0].icon);
        var iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
        var weatherIcon = $("<img>");
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", "weather icon");
        $("#city").html("<h1>" + response.name + ' : ' + todaysDate + "</h1>").attr("style", "color:white");
        $("#city").append(weatherIcon)
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $("#temp").text(tempF.toFixed(1) + " F");
        $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");


        displayForecast(city)
    });
}

// Display 5 Day Forecast
function displayForecast(city) {
    var queryURL = forecastURL + city + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("#forecast").empty();
       
        for (let i = 0; i < response.list.length; i++) {
            var curr = response.list[i];
            if (curr.dt_txt.includes("12:00")) {
                var newDiv = $("<div>").appendTo("#forecast");
                newDiv.addClass("5day col-2 float-left ml-4 bg-light rounded");
                // console.log(curr.dt_txt);
                console.log(response.city.name)
                console.log([i]);
                var iconURL = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png"
                var weatherIcon = $("<img>");
                weatherIcon.attr("src", iconURL);
                weatherIcon.attr("alt", "weather icon");
                var temp = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                var tempF = temp.toFixed(1)
                var windSpeed = response.list[i].wind.speed
                var humidity = response.list[i].main.humidity
                var city = response.city.name
                // $(".5day").attr("style", width, 200)
                // $(".5day").attr("style", height, 200)
                $(".5day").text(city + " " + tempF + " " + windSpeed + " " + humidity)
                // "<br>" + tempF + "<br>" + windSpeed + "<br>" + humidity);
                // $(".5day").append(weatherIcon);
                // $(".5day").text(tempF);
                // $(".5day").text(windSpeed);
                // $(".5day").text(humidity);

// class="col-2 float-left ml-4 bg-light rounded" style="height: 200px; width: 200px;"
            }
        }
    });
}

// Create Button Divs for City History
function renderDivs() {
    $("#cities-view").empty();

    for (var i = 0; i < cities.length; i++) {
        var newCity = $("<button>");
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
    var city = $("#city-input").val().trim();
    console.log(city);
    cities.push(city);
    renderDivs();
    var queryURL = dayStarterURL + city + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.name);
        var iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
        var weatherIcon = $("<img>");
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", "weather icon");
        $("#city").html("<h1>" + response.name + ' : ' + todaysDate + "</h1>");
        $("#city").append(weatherIcon)
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $("#temp").text(tempF.toFixed(1) + " F");
        $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
    });

});

$(document).on("click", ".city", displayCityBtn);

renderDivs();