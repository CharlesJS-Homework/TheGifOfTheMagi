/* eslint-env browser, jquery, es6 */

const apiKey = 'xA6RmMBVdoPj1jG0wkGORoi9BKpO6ibt';

const defaultQueries = ['chili eyes', 'evil laugh', 'facepalm', 'shark attack', 'spider attack', 'kitten attack', 'squirrel attack', 'car crash', 'jesus', 'captain kirk', 'jack nicholson', 'creepy child', 'potassium', 'mentos and coke', 'this is fine'];
const resultLimit = 10;

let queries;

$(document).ready(() => {
  const queriesString = localStorage.getItem('queries');

  if (queriesString) {
    queries = JSON.parse(queriesString);
  } else {
    queries = defaultQueries;
  }

  $('#query-form').on('submit', (event) => {
    event.preventDefault();

    const query = $('#query-input').val();

    if (query.length === 0 || queries.includes(query)) {
      return;
    }

    queries.push(query);
    refreshQueryButtons();
  });

  refreshQueryButtons();
});

function refreshQueryButtons() {
  const queryDiv = $('#query-buttons');

  queryDiv.empty();

  $.each(queries, (_, eachQuery) => {
    const button = $('<button class="query-button">');

    button.attr('query-string', eachQuery);
    button.text(eachQuery);
    button.on('click', queryButtonClick);

    queryDiv.append(button);
  });
}

function queryButtonClick() {
  const queryString = $(this).attr('query-string');

  const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${queryString}&limit=${resultLimit}`;

  $.getJSON(queryURL, (response) => {
    const resultsList = $('#search-results');

    $.each(response.data.reverse(), (_, eachGif) => {
      const title = eachGif.title.replace(/\s*GIF$/, '');
      const rating = eachGif.rating.toUpperCase();

      const still = eachGif.images.fixed_width_still;
      const animated = eachGif.images.fixed_width;

      const img = $('<img>').attr('src', still.url).attr('alt', title);
      img.attr('class', 'result-img');
      img.attr('still', still.url).attr('animated', animated.url);
      img.attr('width', still.width).attr('height', still.height);
      img.on('click', imageClicked);

      const li = $('<li class="search-result">');
      const anchor = $('<a>').attr('href', eachGif.url).text(title);

      li.append($('<h2 class="result-title">').append(anchor));
      li.append($('<h3 class="result-rating">').text(`Rating: ${rating}`));
      li.append(img);

      resultsList.prepend(li);
    });
  });
}

function imageClicked() {
  const still = $(this).attr('still');
  const animated = $(this).attr('animated');

  if ($(this).attr('src') === still) {
    $(this).attr('src', animated);
  } else {
    $(this).attr('src', still);
  }
}
