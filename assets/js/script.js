var inputEl = document.querySelector('.input');
var btnEl = document.querySelector('.searchbtn');
var clearBtn = document.querySelector('.clearbtn')
var cityEl = document.querySelector('.cityTitle');
var citiesArea = document.querySelector('.cities-list');
var dateEl = document.querySelector('.date');
var tempEl = document.querySelector('.temp');
var windEl = document.querySelector('.wind');
var imgEl = document.querySelector('.image');
var humidityEl = document.querySelector('.humidity');
var uvIndex = document.querySelector('.uvIndex');
var boxes = document.querySelectorAll(".box")
var wrapper = document.querySelector(".wrapper")
var searches =  JSON.parse(localStorage.getItem('cities')) || [];
var weatherApi = "https://api.openweathermap.org/data/2.5/weather"
var weatherApi2 = "https://api.openweathermap.org/data/2.5/forecast"
var uvApi = "https://api.openweathermap.org/data/2.5/onecall"
var apiKey = "91c21922d0972d91962491f9639fd762"


clearBtn.addEventListener("click", function(){
  localStorage.removeItem("cities")
  searches = []
  renderCities()
  wrapper.style.display="none"
})

btnEl.addEventListener("click", function() {
  var inputVal = inputEl.value
  wrapper.style.display="block"
if (inputVal !=""){
  getWeather(inputVal) // fetch api
  searches.unshift(inputVal); // [austin , cairo]
  renderCities()
  inputEl.value = "";
  localStorage.setItem("cities", JSON.stringify(searches))
}else{
  alert("You must enter a city")
}
});

function kvToFa(kelvin){
return ((kelvin-273.15)*1.8)+32	
}

inputEl.addEventListener("keyup", function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    btnEl.click();
  }
});

function renderCities(){
  citiesArea.innerHTML = ""
  for(var i = 0; i< searches.length ; i++) {
    var span = document.createElement('span');
    var txt  = document.createTextNode(searches[i]);
    span.className = 'd-block bg-light p-2 mb-1';
    span.appendChild(txt);
    span.addEventListener('click' ,function(){
      getWeather(this.textContent)
      removeActiveClass()
      this.classList.add("active")
    })
    citiesArea.appendChild(span);

    document.querySelector('.cities-list span:first-child').classList.add('active');
  }
}

function removeActiveClass(){
  var allCities = document.querySelectorAll(".cities-list span")
  allCities.forEach(function(city){
    city.classList.remove("active")
  })
  }

renderCities()
if(searches.length > 0 ) {
  var lastCity = searches[0] // [ "eeeee", "ggggg", "ssss"] // searches[2]
  document.querySelector('.cities-list span:first-child').classList.add('active')
  getWeather(lastCity);
} else {
  wrapper.style.display = "none"
}

function getWeather(cityName){
  axios.get(weatherApi + "?q=" + cityName + "&appid=" + apiKey)
    .then(function(response){
      viewData(response.data);
    })
    .catch(function(error){
    })
}

function viewData(weather){
  tempEl.innerHTML = "Temp: " + Math.floor(kvToFa (weather.main.temp)) + "°F";
  windEl.innerHTML = "Wind: " + weather.wind.speed + " MPH"
  humidityEl.innerHTML = "Humidity: " + weather.main.humidity + "%"
  cityEl.innerHTML = weather.name
  var lat = weather.coord.lat
  var lon = weather.coord.lon;
  var date = (moment(weather.dt * 1000));
  var month = date.format('M');
  var day   = date.format('D');
  var year  = date.format('YYYY');
  dateEl.innerHTML = (month + "/" + day + "/" + year);
  imgEl.src = "http://openweathermap.org/img/w/" + weather.weather[0].icon +".png"
  getUvIndex(lat, lon)
  getForeCast(weather)
}

function getUvIndex(lat, lon) {
  axios.get(uvApi + "?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey)
  .then(function(response){
    var uvi = response.data.current.uvi
    uvIndex.innerHTML = "UV Index: " + uvi;  
    if (uvi < 2){
      uvIndex.className = "badge badge-success"
    }else if(uvi >=2 && uvi <5){
      uvIndex.className = "badge badge-warning"
    } else{
      uvIndex.className = "badge badge-danger"
    }
  })
}

function getForeCast(weather) {
  fetch(weatherApi2 + "?q=" + weather.name + "&appid=" + apiKey)
  .then (function(response){
    return response.json()
  })
  .then(function(data){
    forecastData(data)
  })
  .catch(function(error){
  })
}


function forecastData(fiveDays){
  for(var i = 0; i < boxes.length; i++){
    boxes[i].innerHTML = ""
    boxes[i].style.display = "block"
    var indexDay = (i * 8) + 4;
    var date2 = moment(fiveDays.list[indexDay].dt * 1000);
    var month = date2.format('M');
    var day = date2.format('D');
    var year  = date2.format('YYYY');
    var  h3  = document.createElement("h3");
    h3.innerHTML = month  + "/" + day + "/" + year;
    boxes[i].append(h3);
    var img = document.createElement("img")
    img.setAttribute("src", "http://openweathermap.org/img/w/" + fiveDays.list[indexDay].weather[0].icon +".png")
    boxes[i].append(img);
    var temp = document.createElement("p")
    temp.innerHTML = "Temp: " + Math.floor(kvToFa(fiveDays.list[indexDay].main.temp)) + "°F";
    boxes[i].append(temp);
    var humidity = document.createElement("p")
    humidity.innerHTML = "Humidity: " + fiveDays.list[indexDay].main.humidity + "%"
    boxes[i].append(humidity);
    var wind = document.createElement("p")
    wind.innerHTML = "Wind: " + fiveDays.list[indexDay].wind.speed + " MPH"
    boxes[i].append(wind);
  }
}