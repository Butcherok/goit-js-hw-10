import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import fetchCountries from "./js/fetchCountries.js";

const DEBOUNCE_DELAY = 300;

let inputData = '';

const form = document.getElementById("search-box");
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

form.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    inputData = e.target.value.trim();

    if (inputData === '') {
        onClearPageInfo();
        onClearPageList();
        return;
    }

    fetchCountries(inputData)
    .then(selectOption)
    .then(updatePageData)
    .catch(onFetchError)
}

function createCountryCard({flags, name, capital, population, languages}) {
    const languageList = languages.map(language => language.name);
    return `
    <h1 class="country-title"><img src='${flags.svg}'width="150px"/>
        <span class="country-title__name">${name}</span>
    </h1>
    <ul class="country-props">
        <li class="country-props__item"><b>Capital:</b> ${capital}</li>
        <li class="country-props__item"><b>Population:</b> ${population}</li>
        <li class="country-props__item"><b>Languages:</b> ${Object.values(languageList).join(', ')}</li>
    </ul>
    `;
}

function createCountryList(country) {
    return `
    <li class="country-list__li"><img src='${country.flags.svg}'width="50px"/>
        <span class="country-list__name">${country.name}</span>
    </li>
    `;
}

function selectOption(countries) {
    const quantity = countries.length;
    if (quantity === 1) {
        onClearPageList();

        return countries.reduce(
            (markup, country) => createCountryCard(country) + markup,
            ""
        );
    } else if (quantity >= 2 && quantity <= 10) {
        onClearPageInfo();

        return countries.reduce(
            (markup, country) => createCountryList(country) + markup,
            ""
        );
    } else if (quantity > 10) {
        onClearPageInfo();
        onClearPageList();
        onFetchErrorInfo();
        return markup = '';
    }
}

function updatePageData(markup) {
    if (markup.includes('h1') ) {
        countryInfo.innerHTML = markup;
    } else  countryList.innerHTML = markup;
}

function onClearPageInfo() {
    countryInfo.innerHTML = '';
}

function onClearPageList() {
    countryList.innerHTML = '';
}

function onFetchErrorInfo() {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
}

function onFetchError(error) {
    onClearPageInfo();
    onClearPageList();

    if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    }
}