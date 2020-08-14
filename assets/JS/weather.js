var apiKey = "&appid=0112a2612ac390c4e897ee81abe957d7"
var dayStarterURL = "https://api.openweathermap.org/data/2.5/weather?q="
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var searchBtn = $(".search_icon");
var currentDay = $("#jumboCD");
var todaysDate = moment().format('l');

var cities = ["Charlotte"];

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
       $("#city").html("<h1>" + response.name + '  ' + todaysDate + "</h1>");
       $("#city").append(weatherIcon)
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $("#temp").text(tempF.toFixed(1) + " F");
        $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        

      });
    }
    // function displayForecast() {
    //     $("#forecast").empty();
    //     var queryURL = forecastURL + city + apiKey;  
    //     $.ajax({
    //       url: queryURL,
    //       method: "GET"
    //     }).then(function (response) {
    //         console.log(response.weather);
    //         var weatherIcon = $("<img>");
    //         weatherIcon.attr("src", "http://openweathermap.org/img/wn/" + response.weather.icon + "@2x.png" );
    //         weatherIcon.attr("alt", "weather icon");
    //        $("#city").html("<h3>" + response.name + '  ' + todaysDate + "</h3>");
    //         var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    //         $("#temp").text(tempF.toFixed(1) + " F");
    //         $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
    //         $("#humidity").text("Humidity: " + response.main.humidity + "%");
    
    
    //       });
    //     }
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

  $(searchBtn).on("click", function(event) {
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
         $("#city").html("<h1>" + response.name + '  ' + todaysDate + "</h1>");
         $("#city").append(weatherIcon)
          var tempF = (response.main.temp - 273.15) * 1.80 + 32;
          $("#temp").text(tempF.toFixed(1) + " F");
          $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
          $("#humidity").text("Humidity: " + response.main.humidity + "%");
        });

  });

  $(document).on("click", ".city", displayCityBtn);

  renderDivs();