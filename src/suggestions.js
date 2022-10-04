import cities from "open-weather-map-city-list"



export default function suggestionLst (event) {

    function findMatches(wordToMatch, cities){
        return cities.filter((city) => {
            const re = new RegExp(wordToMatch, 'ig')
            return city.name.match(re) 
        })
    }

    const foundPlaces = findMatches(event.target.value, cities).splice(0, 5);
    const html = foundPlaces.map(city => {
        const reg = new RegExp(event.target.value, 'gi')
        const cityName = city.name.replace(reg, `<span class="hl">${event.target.value}</span>`)
        return `
            <li>
                <span class="name">${cityName}, ${city.country}</span>
            </li>
        `;
    }).join("")
    document.querySelector(".suggestions").innerHTML = html;

}