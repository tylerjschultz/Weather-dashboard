
var currentDate = new Date();
currentDate = currentDate.toLocaleDateString();


var submitBtnEl = document.querySelector('.submit-btn');
var citySearchBtnsList = document.querySelector('#search-buttons-list');


var searchCities = [];

// finds current weather 
var getWeatherData = function(cityName) {
    var currentCityDate = document.querySelector('#city-date');

  
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=03bb68255464b077b300ee6581abfffb&units=imperial';

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
    
            response.json().then(function(data) {
               
                var cityBtnEl = document.createElement("button");
                cityBtnEl.classList.add("city-search-btn");
                cityBtnEl.setAttribute("id", "city-" + cityName);
                cityBtnEl.textContent = cityName;
                document.querySelector('#search-buttons-list').appendChild(cityBtnEl);
                // stores city data
                searchCities.push(cityName);
                // saves the data
                saveCities();

                var iconCode = data.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                var weatherIconEl = document.querySelector('#wicon');
                currentCityDate.textContent = cityName + " (" + currentDate + ")";
                weatherIconEl.setAttribute("src", iconUrl);
                weatherIconEl.setAttribute("style", "display: block");
                document.querySelector('#current-temp').textContent = "Temp: " + data.main.temp;
                document.querySelector('#current-wind').textContent = "Wind: " + data.wind.speed + " MPH";
                document.querySelector('#current-humidity').textContent = "Humidity: " + data.main.humidity + " %";
                var cityLat = data.coord.lat;
                var cityLon = data.coord.lon;
                getUV(cityLat, cityLon);
            });
        } else {
            // error response
            alert("Could not find the city. Please try again.");
        }
    });

};

var getUV = function(lat, lon) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=03bb68255464b077b300ee6581abfffb';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var currentUVI = data.current.uvi;
                document.querySelector('#current-uvi').textContent = currentUVI;
                var currentUVIDiv = document.querySelector('#uvi');
                if (currentUVI < 3) {
                    currentUVIDiv.classList.add("favorable");
                } else if (currentUVI <= 5) {
                    currentUVIDiv.classList.add("moderate");
                } else {
                    currentUVIDiv.classList.add("severe");
                }

                getDailyForecast(data);
            });
        }
    });
};

var getDailyForecast = function(data) {
    // sets the date for the next 5 days
    var currentDayPlusOne = new Date();
    currentDayPlusOne.setDate(currentDayPlusOne.getDate() + 1);
    document.querySelector('#day-1-date').textContent = currentDayPlusOne.toLocaleDateString();
    
    var currentDayPlusTwo = currentDayPlusOne;
    currentDayPlusTwo.setDate(currentDayPlusTwo.getDate() + 1);
    document.querySelector('#day-2-date').textContent = currentDayPlusTwo.toLocaleDateString();
    
    var currentDayPlusThree = currentDayPlusTwo;
    currentDayPlusThree.setDate(currentDayPlusThree.getDate() + 1);
    document.querySelector('#day-3-date').textContent = currentDayPlusThree.toLocaleDateString();
    
    var currentDayPlusFour = currentDayPlusOne;
    currentDayPlusFour.setDate(currentDayPlusOne.getDate() + 1);
    document.querySelector('#day-4-date').textContent = currentDayPlusFour.toLocaleDateString();
    
    var currentDayPlusFive = currentDayPlusOne;
    currentDayPlusFive.setDate(currentDayPlusOne.getDate() + 1);
    document.querySelector('#day-5-date').textContent = currentDayPlusFive.toLocaleDateString();

    for (var i = 1; i < 6; i++) {
        document.querySelector('#day-'+ i + '-temp').textContent = "Temp: " + data.daily[i].temp.max;
        document.querySelector('#day-'+ i + '-wind').textContent = "Wind: " + data.daily[i].wind_gust + " MPH";
        document.querySelector('#day-'+ i + '-humidity').textContent = "Humidity: " + data.daily[i].humidity + " %";
        var iconCode = data.daily[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var weatherIconEl = document.querySelector('#wicon-' + i);
        weatherIconEl.setAttribute("src", iconUrl);
        weatherIconEl.setAttribute("style", "display: block");
    }

};

var saveCities = function() {
    localStorage.setItem("searchCities", JSON.stringify(searchCities));
};

var loadCities = function() {
    var cities = JSON.parse(localStorage.getItem("searchCities"));

    if (!cities) {
        cities = [];
    }

    for (var i = 0; i < cities.length; i++) {
        var cityBtnEl = document.createElement("button");
        var inputCity = cities[i];
        cityBtnEl.classList.add("city-search-btn");
        cityBtnEl.setAttribute("id", "city-" + inputCity);
        cityBtnEl.textContent = inputCity;
        document.querySelector('#search-buttons-list').appendChild(cityBtnEl);
    }

    searchCities = cities;
};


var getSearchCity = function(event) {
    event.preventDefault();
    var inputCity;
    if (event.target.classList.contains("submit-btn")) {
        var inputEl = document.querySelector('#city-search');
        inputCity = inputEl.value;
        inputEl.value = "";
    } else {
        inputCity = event.target.textContent;
        document.querySelector('#city-' + inputCity).remove();
    }
    
    getWeatherData(inputCity);
    
};

submitBtnEl.addEventListener("click", getSearchCity);
citySearchBtnsList.addEventListener("click", getSearchCity);
loadCities();