// "use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

// ///////////////////////////////////////
const render_country = function (data, class_name = "") {
  // Format languages as a string
  const languages = Object.values(data.languages).join(", ");

  // Format currencies as a string
  const currencies = Object.values(data.currencies)
    .map((currency) => `${currency.symbol}${currency.name}`)
    .join(", ");

  const html = `
      <article class="country ${class_name}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)} people</p>
          <p class="country__row"><span>🗣️</span>${languages}</p>
          <p class="country__row"><span>💰</span>${currencies}</p>
          <p class="country__row"><span>tz</span>${data.timezones[0]}</p>
        </div>
      </article>
`;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  // countriesContainer.style.opacity = 1;
};

const render_error = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  // countriesContainer.style.opacity = 1;
};
const get_json = function (url, error_msg = "") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${error_msg} ${response.status}`);
    return response.json();
  });
};

// // const get_country_neighbor_data = function (country) {
// //   const request = new XMLHttpRequest();
// //   //NOTE
// //   // open is the url which are going to call
// //   // send is send the request to get the data
// //   // we attach the event listener to the request object when the request object get reponse than it will laod the event
// //   console.log("");

// //   request.open("GET", `https://restcountries.com/v3.1/name/${country}`);

// //   request.send();

// //   request.addEventListener("load", function () {
// //     const [data] = JSON.parse(this.responseText);
// //     console.log(data);
// //     render_country(data);

// //     //Get neighors country
// //     const [neighbour] = data.borders;
// //     if (!neighbour) return;

// //     //AJAX call country 2
// //     const request2 = new XMLHttpRequest();
// //     request2.open("GET", `https://restcountries.com/v3.1/alpha/${neighbour}`);
// //     request2.send();
// //     request2.addEventListener("load", function () {
// //       const [data_2] = JSON.parse(this.responseText);
// //       console.log(data_2);
// //       render_country(data_2, "neighbour");
// //     });
// //   });
// // };
// // get_country_neighbor_data("usa");

const get_country_data = function (country) {
  // main country
  get_json(
    `https://restcountries.com/v3.1/name/${country}`,
    "Country not found"
  )
    .then((data) => {
      render_country(data[0]);

      const neighbour = data[0]?.borders?.[0];
      if (!neighbour) throw new Error(`Neighbour not found`);
      return get_json(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        "country not found"
      );
    })
    .then((data) => render_country(data[0], "neighbour"))
    .catch((err) => {
      console.error(err);
      render_error(`Something went wrong ${err.message}. Try again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
// btn.addEventListener("click", function () {
//   get_country_data("australia");
// });

const where_am_i = function (lat, lng) {
  get_json(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then((data) => {
      console.log(data);
      if (data.distance == "Throttled! See geocode.xyz/pricing") {
        throw new Error(
          "You call the api more than one time in a second, Throttled! See geocode.xyz/pricing"
        );
      }
      const country = data.country;
      const city = data.city;
      console.log(`You are in ${city}, ${country}`);
      get_country_data(country.toLowerCase());
    })
    .catch((err) => {
      render_error(err);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
const arr = [
  // [52.508, 13.381],
  // [19.037, 72.873],
  [-33.933, 18.474],
  [33.6844, 73.047],
];
arr.forEach((arr) => {
  setTimeout(() => {
    where_am_i(...arr);
  }, 1000);
});
