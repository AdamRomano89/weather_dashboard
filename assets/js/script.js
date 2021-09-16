var inputEl = document.querySelector('.input');
var btnEl = document.querySelector('.searchbtn');
var cityEl = document.querySelector('.cityTitle');
var citiesArea = document.querySelector('.cities-list');
var tempEl = document.querySelector('.temp');
var windEl = document.querySelector('.wind');
var humidityEl = document.querySelector('.humidity');
var uvIndex = document.querySelector('.uvIndex');
var weatherApi = "https://api.openweathermap.org/data/2.5/weather"
var weatherApi2 = "pro.openweathermap.org/data/2.5/forecast/hourly"
var apiKey = "91c21922d0972d91962491f9639fd762"
var searches = [];

btnEl.addEventListener("click", function() {
  var inputVal = inputEl.value
  getWeather(inputVal) // fetch api
  searchHistory(inputVal) //  render cities 
  inputEl.value = ""
  localStorage.setItem("cities", JSON.stringify(searches))
});


function getWeather(cityName){
  console.log(cityName);
  axios.get(weatherApi + "?q=" + cityName + "&appid=" + apiKey)
  .then(function(data){
    console.log(data);
  })
  .catch(function(error){
    console.log(error);
  })
}

function searchHistory(city){
  citiesArea.innerHTML = ""
  searches.push(city); // [] => ['wfwefwe] => ['wefwefwef','hhhh']
  for(var i = 0; i< searches.length ; i++) {
    var span = document.createElement('span');
    var txt  = document.createTextNode(city);
    span.className = 'd-block bg-light p-2 mb-1';
    span.appendChild(txt);
    console.log(span);
    citiesArea.appendChild(span);
  }
  
}


//<span class="d-block bg-light p-2 mb-1">Austin</span>
