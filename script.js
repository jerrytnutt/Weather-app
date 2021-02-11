const headerDiv = document.querySelector('.header')
const dataBoxes = document.querySelectorAll('.data div')
const fahrenheitSymbol = document.querySelector('.fahrenheit')
const celsiusSymbol = document.querySelector('.celcius')

let tempature = 0
let feelsLike = 0

async function receiveWeatherData (identifier,searchType) {
  const myKey = config.MY_KEY;
  
  if(searchType == 'city'){

    var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${identifier}&appid=${myKey}`);
  
  }else if(searchType == 'coordinates'){
    
    var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${identifier[0]}&lon=${identifier[1]}&appid=${myKey}`)
  }

   var data = await response.json();

   return data
}

const clearBoxes = () => {
  
  dataBoxes.forEach((box) => {
    box.childNodes[1].textContent = ''
  })
}

const searchButton = document.querySelector('.fa-search')
const cityInput = document.querySelector('.city')

searchButton.addEventListener('click', () => {
  const cityName = cityInput.value

  return receiveWeatherData(cityName,'city')
  .then( (data) => { 
    parseData(data)
  })
  .catch( (reason) => {
    alert(reason.message)
  })
})

const getLocation = document.querySelector('.fa-map-marker')

getLocation.addEventListener('click',() => {
  
    if (navigator.geolocation) {
      //callback function for geolocation method getCurrentPosition()
      const showPosition = (position) => {
        const lat = position.coords.latitude
        const long = position.coords.longitude

        return receiveWeatherData([lat,long],'coordinates')
          .then( (data) => { 
          parseData(data)
         })
          .catch( (reason) => {
           console.log(reason.message)
          })
       }
      
      navigator.geolocation.getCurrentPosition(showPosition); 
  } else {
      alert('error, no geoLocation detected')
    }
});


const parseData = (data) => {
  // Convert temp to fahrenheit and add symbols for measurements
  clearBoxes()
  const weatherData = {
    name: data.name,
    country: data.sys.country,
    icon: data.weather[0].icon,
    weatherDescription: data.weather[0].description,
    tempature :'°'+Math.round(  (9/5)*(data.main.temp  - 273) + 32),
    humidity: data.main.humidity+'%',
    pressure: data.main.pressure+' mb',
    wind: data.wind.speed+' mph',
    feelsLike: '°'+Math.round(  (9/5)*(data.main.feels_like  - 273) + 32),
  }
  return displayData(weatherData)
  
}

const displayData = (obj) => {

  tempature = obj.tempature
  feelsLike = obj.feelsLike

  const flagIcon = document.querySelector('.flag')
  flagIcon.src = `https://www.countryflags.io/${obj.country}/flat/64.png`

  const weatherIcon = document.querySelector('.weatherImg')
  weatherIcon.src = `http://openweathermap.org/img/wn/${obj.icon}@4x.png`
  
  const location = document.querySelector('.locationName')
  location.innerHTML = `${obj.name}, ${obj.country}`

  const weatherArray = [obj.weatherDescription,obj.tempature,obj.humidity,obj.pressure,obj.wind,obj.feelsLike]

  let i = 0
  dataBoxes.forEach((box) => {
    box.childNodes[1].textContent = weatherArray[i]
    i = i+1

  })
  //convert default temp display back to fahrenheit
  if (fahrenheitSymbol.classList.contains('clear')){
    fahrenheitSymbol.classList.remove("clear");
    celsiusSymbol.classList.add("clear");
    headerDiv.style.backgroundColor = 'orange'
  }

}

const tempChangeButton = document.querySelector('.tempChange')
tempChangeButton.addEventListener('click',() => {
  return changeTemp()
});

const changeTemp = () => {
  if (fahrenheitSymbol.classList.contains('clear')){

    fahrenheitSymbol.classList.remove("clear");
    celsiusSymbol.classList.add("clear");
    headerDiv.style.backgroundColor = 'orange'

    dataBoxes[1].childNodes[1].innerHTML = tempature
    dataBoxes[5].childNodes[1].innerHTML = feelsLike

  } else if (celsiusSymbol.classList.contains('clear')){
    celsiusSymbol.classList.remove("clear");
    fahrenheitSymbol.classList.add("clear");
    headerDiv.style.backgroundColor = '#75c3e5';

    let celsiusTemp = parseInt( tempature.slice(1) );
    celsiusTemp = '°'+Math.round((celsiusTemp  - 32) * .5556)
    dataBoxes[1].childNodes[1].innerHTML = celsiusTemp
  
    celsiusTempFeels = parseInt(feelsLike.slice(1));
    celsiusTempFeels  = '°'+Math.round((celsiusTempFeels   - 32) * .5556)
    dataBoxes[5].childNodes[1].innerHTML = celsiusTempFeels 
  }

}

// iife for example city when pages is loaded
(() => 
{
  receiveWeatherData('austin','city')
  .then(data => parseData(data))
  .catch(reason => console.log(reason.message))
})()



