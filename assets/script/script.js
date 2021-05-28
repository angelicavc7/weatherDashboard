
var APIkey = '174d85473d9c790313eefc66d2e14507';

today = moment();
    $("#date").text(today.format("dddd, MMM Do"));

    var searchFormEl = document.querySelector('#search-city');
    var resultTextEl = document.querySelector('#currentCityName');
    var currentCityName;
    
    var weather = [];
    var cityList = [];
    function handleSearchFormSubmit(event) {
        event.preventDefault();
        var searchInputVal = document.querySelector('#search-input').value;
        if (!searchInputVal) {
          console.error('You need a search input value!');
          return;
        }
        searchApi(searchInputVal);
      } 
      
      //function to load the text from memory
    
    function loadCityList(cityList) { 
        cityList = JSON.parse(localStorage.getItem("cityList"));
        if(!cityList) {  
            //check to see if the variable exists
            console.log("- No saved information"); 
            //prints error message in console
            cityList=[];
            return cityList;
        }
        return cityList;
    }
    
    function showCityList(cityList) {  
        //displays the list of cities chosen in the past
        var varText = "";
        for (var i = 0; i < cityList.length; i++) {
          varText += `<li class="btn list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="searchApi('`+cityList[i]+`')">`+cityList[i]+`</li>`;
        }
        $(`#cityListGroup`).html(varText);
    }
    
    function updateCityList(currentCityName) {  
        //saves the city list to local storage
        cityList.indexOf(currentCityName) === -1 ? cityList.push(currentCityName) : console.log("City already on list")
        localStorage.setItem("cityList", JSON.stringify(cityList)); //saves cityList
        showCityList(cityList);
    }
    

    function displayWeather(weather) {  
        //updates the weather information for the various IDs
        $("#day0-wind").text(weather[0].wind);
        $("#day0-UV").text(weather[0].UV);
        $(`#currentCityName`).text(currentCityName);
        if (weather[0].UV >= 11) {varUV = `Violet`}; 
        if (weather[0].UV < 11) {varUV = `Red`}; 
        if (weather[0].UV < 8) {varUV = `Orange`}; 
        if (weather[0].UV < 6) {varUV = `Yellow`}; 
        if (weather[0].UV < 3) {varUV = `Green`}; 
        $(`#day0-UV`).css( "background-color", varUV);
        for (var i = 0; i <= 5; i++) {
            $(`#day`+i+`-temp`).text(weather[i].temp);
            $(`#day`+i+`-icon`).html(weather[i].icon);
            $(`#day`+i+`-hum`).text(weather[i].hum);
            $(`#day`+i+`-date`).html(weather[i].date);
            $(`#day`+i+`-icon`).attr("src",weather[i].icon);
        }
    }
    
    
    function searchApi2(varLat, varLon, currentCityName) { 
         //have to search onecal API to get 5 day forcast 
        var locQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=`+varLat+`&lon=`+varLon+`&exclude=hourly&units=imperial&appid=174d85473d9c790313eefc66d2e14507`;
        fetch(locQueryUrl)
          .then(function (response) {
            console.log(response)
            if (!response.ok) {
              throw response.json();
            }
            console.log(response.json)
            return response.json();
          })
          .then(function (locRes) {
            console.log(locRes);
            weather = [];
            updateCityList(currentCityName);
            for (var i = 0; i < 7; i++) {
                 var wDay = {
                     "date":locRes.daily[i].dt,
                     "temp":locRes.daily[i].temp.day+` °F`,
                     "hum":locRes.daily[i].humidity+`%`,
                     "wind":locRes.daily[i].wind_speed+` MPH`,
                     "UV":locRes.daily[i].uvi,
                     "icon":`https://openweathermap.org/img/wn/`+locRes.daily[i].weather[0].icon+`.png`
                 }
            wDay.date=wDay.date * 1000;
            const dateObject = new Date(wDay.date);
            wDay.date=dateObject.toLocaleDateString();
            weather.push(wDay);
            }   
            displayWeather(weather);
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    
    function searchCity(query) {
        var searchedCityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=`+query+`&appid=174d85473d9c790313eefc66d2e14507`;
     
        fetch(searchedCityUrl)
          .then(function (response) {
            console.log(response);
            if (!response.ok) {
              $("#search-Input")[0].reset()
              alert("ERROR: City not found");
              throw response.json();
            }
            console.log(response.json);
            return response.json();
          })
          .then(function (locRes) {
            varLat = locRes.city.coord.lat;
            varLon = locRes.city.coord.lon;
            currentCityName = query;
            console.log(currentCityName + ` located at:`+varLat+`x`+ varLon);
            searchApi2(varLat, varLon, currentCityName);
        })
          .catch(function (error) {
            console.error(error);
          });
    }
    
    
    searchFormEl.addEventListener('submit', handleSearchFormSubmit);
    
    cityList = loadCityList(cityList);
    searchCity("Seattle");
    