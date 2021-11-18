console.log('petstore.js is running');

var userFormEl = document.querySelector('#user-form');
var zipInputEl = document.querySelector('#zip-input');
//box they enter the zipcode into
var zipButtonEl = document.querySelector('#search');
//button to search zipcode
var storeContainerEl = document.querySelector('#store-container');
//area the store will be displayed
//uses the zipcode results to get the lat/long
var getCoords = function (zipcode) {
	var apiUrl =
		'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCYO2vxRIUA51sE3nmmVld6f-n0OMzk80c&components=postal_code:' +
		zipcode;
	console.log('apiUrl' + apiUrl);
	fetch(apiUrl)
		.then(function (response) {
			if (response.ok) {
				console.log(response);
				response.json().then(function (data) {
					console.log(data);
					console.log(data.results[0].geometry.location.lat);
					console.log(data.results[0].geometry.location.lng);
					findStore(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
				});
			} else {
			}
		})
		.catch(function (error) { });
};

var showStore = function (store) {
	console.log(store);
	var storeName = store.City;
	var storePhone = store.PhoneNumber;
	var storeEl = document.createElement('p');
	var phoneEl = document.createElement('p');
	storeContainerEl.appendChild(storeEl);
	storeContainerEl.appendChild(phoneEl);
	storeEl.textContent = storeName;
	phoneEl.textContent = storePhone;
	console.log(storeName);
};

var findStore = function (lat, lng) {
	// var apiUrlPet = 'https://cors-anywhere.herokuapp.com/https://api.petsmart.com/v1/search/stores?model.latitude=39.8649819&model.longitude=-75.07512410000001';
	var apiUrlPet =
		'https://cors-anywhere.herokuapp.com/https://api.petsmart.com/v1/search/stores?model.latitude=' +
		lat +
		'&model.longitude=' +
		lng;
	console.log('apiUrlPet' + apiUrlPet);
	console.log('findStore' + lat + lng);
	fetch(apiUrlPet).then(function (response) {
		if (response.ok) {
			response.json().then(function (data) {
				console.log(data);
				console.log(data.StoreSearchResults[0].Store.City);
				console.log(data.StoreSearchResults[0].Store.PhoneNumber);
				showStore(data.StoreSearchResults[0].Store);
			});
		}
	});
};

var zipcodes = [];

var zipFormEl = document.querySelector('#zip-search-form');
var zipCodeInputEl = document.querySelector('#zip-input');
var pastSearchButtonEl = document.querySelector('#past-search-buttons');
// var zipButtonEl = document.querySelector("#zip-button");

var formSearch = function (event) {
	console.log("formSearch");
	event.preventDefault();
	var zip = zipCodeInputEl.value.trim();
	if (zip) {
		zipcodes.unshift({ zip });
		getCoords(zip);
		storeContainerEl.textContent = "";
		zipCodeInputEl.value = "";
	}
	// saveSearch();
	pastSearch(zip);
	console.log(zip)
};

// function init() {
//   // Get stored todos from localStorage
//   var storedTodos = JSON.parse(localStorage.getItem("todos"));

//   // If todos were retrieved from localStorage, update the todos array to it
//   if (storedTodos !== null) {
//     todos = storedTodos;
//   }

//   // This is a helper function that will render todos to the DOM
//   renderTodos();
// }

// function storeTodos() {
//   // Stringify and set key in localStorage to todos array
//   localStorage.setItem("todos", JSON.stringify(todos));
// }

function init() {
	var saveSearch = JSON.parse(localStorage.getItem("zipcodes"));
	if (saveSearch !== null) {
		zip = saveSearch;
	}
}
function saveSearch() {
	localStorage.setItem("zipcodes", JSON.stringify(zip));
	console.log(localStorage);
}

init();

var pastSearch = function (pastSearch) {
	console.log('past Search: ', pastSearch);
	if (pastSearch != '') { // zipcode is NOT empty
		var pastSearchEl = document.createElement('button');
		pastSearchEl.textContent = pastSearch;
		pastSearchEl.classList = 'border';
		pastSearchEl.setAttribute('data-zipcodes', pastSearch);
		//   pastSearchEl.setAttribute("type", "click");
		pastSearchEl.addEventListener('click', searchAgain);
		pastSearchButtonEl.prepend(pastSearchEl);
	}
};

// pastSearch();
var searchAgain = function (event) {
	event.preventDefault();
	console.log(event);
	console.log(event.target);
	var targetZip = event.target.getAttribute('data-zipcodes');
	console.log(targetZip);
	getCoords(targetZip);
};
zipFormEl.addEventListener('submit', formSearch);
