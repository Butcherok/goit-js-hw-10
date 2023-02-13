import Notiflix from 'notiflix';

function fetchCountries(name) {
    const url = `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`

    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Oops, there is no country with that name');
        } else {
            return response.json();
        }
    })
    .catch(err => {
        Notiflix.Notify.failure(`${err}`);
    })
    };

export default fetchCountries;

