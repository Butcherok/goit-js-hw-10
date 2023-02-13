function fetchCountries(name) {
    const url = `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`

    return fetch(url).then(response => response.json());
}
export default fetchCountries;