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

    fetchCountries(inputData)
    .then(selectOption)
    .then(updatePageData)
    .catch(onFetchError)
}

function createCountryCard({flags, name, capital, population, languages}) {
    const languageList = languages.map(language => language.name);
    return `
    <div class="card">
    <p class="country_name">
        <span class="country_flag">
        <img src="${flags.svg}" width="30px" height="20px">
        </span> <b>${name}</b>
    </p>
    <p class="country_descr"> <b>Capital:</b> ${capital}</p>
    <p class="country_descr"> <b>Population:</b> ${population}</p>
    <p class="country_descr"> <b>Languages:</b> ${Object.values(languageList).join(', ')}</p>
    </div>
    `;
}

function createCountryList(country) {
    return `
    <li>
        <p class="country_name">
            <span class="country_flag">
                <img src="${country.flags.svg}" width="30px" height="20px">
            </span> <b>${country.name}</b>
        </p>
    </li>
    `;
}

function selectOption(countries) {
    const quantity = countries.length;
    if (quantity === 1) {
        onClearPageInfo();

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
    } else if (quantity === 0) {
        // onClearPageInfo();
        // onClearPageList();
        onFetchError();
        return markup = '';
    } else if (quantity === "") {
        // onClearPageInfo();
        // onClearPageList();
        return markup = '';
    }
}

function updatePageData(markup) {
    if (markup === createCountryCard) {
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

function onFetchError() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}


// Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення
// "Too many matches found. Please enter a more specific name."

// Якщо бекенд повернув від 2-х до 10-и країн,
// Кожен елемент списку складається з прапора та назви країни.

// Якщо результат запиту - це масив з однією країною, 
// про країну: прапор, назва, столиця, населення і мови.

// Якщо користувач ввів назву країни, якої не існує, 
// бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не знайдено.
// Додай повідомлення "Oops, there is no country with that name"

// Не забувай про те, що fetch не вважає 404 помилкою, тому необхідно явно відхилити проміс, щоб можна було зловити і обробити помилку.

// Notiflix.Report.success('Title', 'Message', 'Button Text');

// Notiflix.Report.failure('Title', 'Message', 'Button Text');

// Notiflix.Report.warning('Title', 'Message', 'Button Text');

// Notiflix.Report.info('Title', 'Message', 'Button Text');