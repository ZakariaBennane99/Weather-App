import './style.css';
import sugg from "./suggestions.js"
import clearSky from "./icons/clear-sky.png"
import fewClouds from "./icons/few-clouds.png"
import brokenClouds from "./icons/broken-clouds.png"
import scatteredClouds from "./icons/scattered-clouds.png"
import showerRain from "./icons/shower-rain.png"
import rain from "./icons/rain.png"
import mist from "./icons/mist.png"
import thunder from "./icons/thunderstorm.png"
import snow from "./icons/snow.png"
import n from "./icons/north.png"
import s from "./icons/south.png"
import ne from "./icons/north-east.png"
import se from "./icons/south-east.png"
import nw from "./icons/north-west.png"
import sw from "./icons/south-west.png"
import e from "./icons/east.png"
import w from "./icons/west.png"
import apiKey from "../api_key"



const inputSearch = document.getElementById("search-input")
const goBtn = document.querySelector('button')
const checkbox = document.querySelector('input[type=checkbox]')


checkbox.addEventListener('change', (e) => {
    const todayTemp = document.querySelector('#deg')
    const subTemps = Array.from(document.querySelectorAll(".temp"))
    if (e.target.checked === true) {
        const todayInCel = Math.round((Number(todayTemp.innerHTML.match(/-?\d/g).join("")) - 32) * 5/9)
        todayTemp.textContent = todayInCel + '\u00b0C'
        console.log(todayTemp.innerHTML)
        subTemps.map((subTemp) => {
            const todayInCel = Math.round((Number(subTemp.innerHTML.match(/-?\d/g).join("")) - 32) * 5/9)
            subTemp.textContent = todayInCel + '\u00b0C'
            console.log(subTemp.innerHTML)
        })
    } else if (e.target.checked === false) {
        const todayInCel = Math.round((Number(todayTemp.innerHTML.match(/-?\d/g).join("")) * 9/5) + 32)
        todayTemp.textContent = todayInCel + '\u00b0F'
        console.log(todayTemp.innerHTML)
        subTemps.map((subTemp) => {
            const todayInCel = Math.round((Number(subTemp.innerHTML.match(/-?\d/g).join("")) * 9/5 ) + 32)
            subTemp.textContent = todayInCel + '\u00b0F'
            console.log(subTemp.innerHTML)
        })
    }
})

// on keyup call sugg
inputSearch.addEventListener('keyup', sugg)


function removeSugg () {
    const suggList = document.querySelectorAll('li')
    suggList.forEach((el) => {
        el.remove()
    })
}


// remove the sugg list if the user clickes elsewhere
document.addEventListener('click', (e) => {
    const suggList = document.querySelectorAll('li')
    if (suggList !== null && e.target.localName !== 'li') {
        removeSugg()
    }
})

// on click call handleData()
goBtn.addEventListener('click', (e) => {
    const userReqCity = e.target.offsetParent.children[0].value.toLowerCase()
    removeSugg()
    handleData(userReqCity)
})
// on Enter call handleData()
inputSearch.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const userReqCity = e.target.offsetParent.children[0].value.toLowerCase()
        removeSugg()
        handleData(userReqCity)
    }
})


function handleDate () {

    const date = new Date()

    const days = {
        0: 'SUNDAY',
        1: 'MONDAY',
        2: 'TUESDAY',
        3: 'WEDNESDAY',
        4: 'THURSDAY',
        5: 'FRIDAY',
        6: 'SATURDAY'
    }

    const months = {
        0: 'JAN',
        1: 'FEB',
        2: 'MAR',
        3: 'APR',
        4: 'MAY',
        5: 'JUN',
        6: 'JUL',
        7: 'AUG',
        8: 'SEP',
        9: 'OCT',
        10: 'NOV',
        11: 'DEC'
    }

    const currentDay = date.getDay()

    // for the following days
    const subDays = []
    let v = currentDay + 1;
    for (var i = 0; i < 4; i++) {
        if (v > 6) {
            v = 0
        }
        subDays.push(days[v])
        v++
    }

    return [days[currentDay], months[date.getMonth()] + ' ' + date.getDate(), subDays]

}


function toCardDirec (angle) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
}


function getWindSpeedIcon (direc) {
    const speedIcons = {
        'N': n,
        'S': s,
        'SE': se,
        'SW': sw,
        'NE': ne,
        'NW': nw,
        'E': e,
        'W': w
    }
    return speedIcons[direc]
}



function renderUI (data) {

    // destructuring the data obj
    const { day, date, degFahr, city, humidity, windDirection, windSpeed, des, windSpeedIcon, otherDaysData } = data

    // getting the elements
    const dy = document.querySelector('#day')
    const dayMon = document.querySelector('#day-month')
    const deg = document.querySelector('#deg')
    const ct = document.querySelector('#city')
    const hm = document.querySelector('#humidity')
    const spDi = document.querySelector('#wind-speed')
    const wIcon = document.querySelector('#weather-icon')
    const windDiIcon = document.querySelector('#wind-direction')

    function changeWeatherIcon (el, d) {
        // getting the main icon
        const poss = [{img: clearSky, descs: ['clear sky']},
            {'img': fewClouds, descs: ['few clouds']},
            {'img': brokenClouds, descs: ['broken clouds', 'overcast clouds']},
            {'img': scatteredClouds, descs: ['scattered clouds']},
            {'img': mist, descs: ['mist', 'Smoke', 'Haze', 'sand/ dust whirls', 'fog', 'sand', 'dust', 'volcanic ash', 'squalls', 'tornado']},
            {'img': snow, descs: ['light snow', 'Snow', 'Heavy snow', 'Sleet', 'Light shower sleet', 'Shower sleet', 'Light rain and snow', 'Rain and snow', 'Light shower snow', 'Shower snow', 'Heavy shower snow', 'freezing rain']},
            {'img': rain, descs: ['light rain', 'moderate rain', 'heavy intensity rain', 'very heavy rain', 'extreme rain']},
            {'img': showerRain, descs: ['light intensity shower rain', 'shower rain', 'heavy intensity shower rain', 'ragged shower rain', 'light intensity drizzle', 'drizzle', 'heavy intensity drizzle', 'light intensity drizzle rain', 'drizzle rain', 'heavy intensity drizzle rain', 'shower rain and drizzle', 'heavy shower rain and drizzle', 'shower drizzle']},
            {'img': thunder, descs: ['thunderstorm with light rain', 'thunderstorm with rain', 'thunderstorm with heavy rain', 'light thunderstorm', 'thunderstorm', 'heavy thunderstorm', 'ragged thunderstorm', '	thunderstorm with light drizzle', 'thunderstorm with drizzle', 'thunderstorm with heavy drizzle']}
        ]

        poss.map((elem) => {
            if (elem.descs.includes(d)) {
                el.src = elem['img']
            }
        })
    }

    // chaging the main board's elements
    changeWeatherIcon(wIcon, des)
    dy.textContent = day
    dayMon.textContent = date
    deg.textContent = degFahr
    ct.textContent = city
    hm.textContent = humidity
    spDi.textContent = windDirection + ' ' + String(windSpeed) + ' KM/H'
    windDiIcon.src = windSpeedIcon

    // changing the other mini boards
    for (var i = 1; i <= 4; i++) {
        document.querySelector(`#day${i}`).textContent = otherDaysData[i-1].dy
        changeWeatherIcon(document.querySelector(`#imgsrc${i}`), otherDaysData[i-1].ds)
        document.querySelector(`#temp${i}`).textContent = otherDaysData[i-1].dg + '\u00b0F'
    }

}


const handleData = async (ct) => {

    const path = 'http://api.openweathermap.org/data/2.5/forecast?q=' + ct + '&units=imperial&APPID=' + apiKey
    const owmReq = fetch(path)
    .then((res) => {
        return res.json()})
    .then((d) => {
        // the list contains all of the data we need
        return d.list })
    .catch ((err) => {
        console.log(err)
        alert('OOPS! something happend. Please refresh the page and try again!') })

    const weatherData = await owmReq


    // remove the current day from list, and slice the array
    // to get the data for the next 4 days only
    const dataForNextDays = weatherData.filter((item) => {
        const d = Number(item.dt_txt.split(" ")[0].split("-")[2])
        const dte = new Date()
        const cd = dte.getDate()
        return d !== cd
    }).slice(0, 32)



    // date handling function
    const dateInfo = handleDate()
    // obj to save the info for the main-board
    // list[0] contains the info for the current day
    const cardDirec = toCardDirec(weatherData[0].wind.deg)
    const weatherInfo = {
        day: dateInfo[0],
        date: dateInfo[1],
        degFahr: Math.round(weatherData[0].main.temp) + '\u00b0F',
        city: ct.toUpperCase(),
        humidity: 'Humidity ' + weatherData[0].main.humidity + '%',
        windDirection: cardDirec,
        windSpeed: weatherData[0].wind.speed,
        des: weatherData[0].weather[0].description,
        windSpeedIcon: getWindSpeedIcon(cardDirec),
        otherDaysData: [{
            dy: dateInfo[2][0],
            ds: '',
            dg: 0,
        }, {
            dy: dateInfo[2][1],
            ds: '',
            dg: 0,
        }, {
            dy: dateInfo[2][2],
            ds: '',
            dg: 0,
        }, {
            dy: dateInfo[2][3],
            ds: '',
            dg: 0,
        }]
    }

    // Averging the temp for the next 4 days
    // and getting the description
    let count = 0
    for (var i = 0; i < 32; i = i + 8) {

        let sum = 0
        for (var j = 0; j < 8; j++) {
            sum += dataForNextDays[i+j].main.temp
        }

        weatherInfo.otherDaysData[count].dg = Math.round(sum/8)
        weatherInfo.otherDaysData[count].ds = dataForNextDays[i].weather[0].description
        count++

    }


    // changing the UI
    renderUI(weatherInfo)

}

handleData('boston')
