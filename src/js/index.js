import '../styles/styles.css';
import _ from 'lodash';
import countriesTemplate from '../templates/countries-card-template.hbs';
import countryService from './services/search_country_service.js';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core/dist/PNotify';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons/iconfont/material-icons.css';

const refs = {
  searchForm: document.querySelector('#search_form'),
  card: document.querySelector('.js-card'),
};

refs.searchForm.addEventListener(
  'input',
  _.debounce(searchFormSubmitHandler, 1000),
);

function searchFormSubmitHandler(e) {
  e.preventDefault();
  clearMarkup();
  const inputValue = e.target.value;
  countryService(inputValue)
    .then(data => {
      if (data.length < 2) {
        buildCardCountry(data);
      } else if ((data.length > 2) & (data.length < 10)) {
        buildCardCountryList(data);
      } else if (data.length > 10) {
        alert({
          text: 'Too many matches found. Please enter a more specific query!',
          maxTextHeight: null,
          width: '400px;',
          sticker: false,
          delay: 1000,
        });
      } else
        error({
          text: 'No such country found.',
          maxTextHeight: null,
          width: '400px;',
          sticker: false,
          delay: 1000,
        });
    })
    .catch(error => console.log(error));
  e.target.value = '';
}

function buildCardCountry(items) {
  const markup = items.map(item => countriesTemplate(item)).join('');
  refs.card.insertAdjacentHTML('beforeend', markup);
}

function buildCardCountryList(items) {
  const markup = items.map(item =>
    refs.card.insertAdjacentHTML('beforeend', `<li>${item.name}</li>`),
  );
}

function clearMarkup() {
  refs.card.innerHTML = ' ';
}
