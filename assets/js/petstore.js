console.log('petstore.js is running');
var zipcodes = [];
//array for user zipcode inputs
var zipInputEl = document.querySelector('#zip-input');
//box they enter the zipcode into
var zipButtonEl = document.querySelector('#search');
//button to search zipcode
var storeContainerEl = document.querySelector('#store-container');
//area the store will be displayed
var zipFormEl = document.querySelector('#zip-search-form');
//form area on html where zip is entered
var pastSearchButtonEl = document.querySelector('#past-search-buttons');
//the buttons that populate with previous zip codes

//getCoords uses the zipcode results to get the lat/long
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
					if (data.results.length !== 0) {
						console.log(data.results[0].geometry.location.lat);
						console.log(data.results[0].geometry.location.lng);
						findStore(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
					}
					else {
						displayModal("Unable to locate Zipcode.");
						storeContainerEl.textContent = "";
					}
				});
			} else {

				displayModal('Error: ' + response.statusText);
			}
		})
		.catch(function (error) {
			displayModal('Unable to locate Zipcode.');
		});
}
var showStore = function (store) {
	console.log(store);
	storeContainerEl.textContent = "";
	var storeName = store.Name;
	var storePhone = store.PhoneNumber;
	var storeStreet = store.StreetLine1;
	var streetEl = document.createElement('p');
	var storeEl = document.createElement('p');
	var phoneEl = document.createElement('a');
	var phoneStr = "tel:" + storePhone;
	phoneEl.setAttribute('href', phoneStr);
	phoneEl.setAttribute('class', "phone-link")
	// dogNameEl.innerHTML = `<span class = "bold">Breed Name: </span> ${dogName}`

	storeContainerEl.appendChild(streetEl);
	storeContainerEl.appendChild(storeEl);
	storeContainerEl.appendChild(phoneEl);

	streetEl.textContent = storeStreet;
	storeEl.textContent = storeName;
	phoneEl.textContent = storePhone;
	console.log(storeStreet + storeName + storePhone);
	
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
function init() {
	var savedZips = JSON.parse(localStorage.getItem("zipcodes"));
	if (savedZips !== null) {
		zipValue = savedZips;
		console.log(savedZips)
		for (var i = 0; i < savedZips.length; i++) {
			pastSearch(savedZips[i])
			console.log(savedZips[i]);
		}

	}
}

var formSearch = function (event) {
	console.log("formSearch");
	event.preventDefault();
	var zip = zipInputEl.value.trim();
	if (zip) {
		getCoords(zip);
		saveZip();
		storeContainerEl.textContent = "";
		storeContainerEl.textContent = "Loading..."
		zipInputEl.value = "";
	}
	pastSearch(zip);
	console.log(zip)
};


function saveZip() {
	console.log('saveZip');
	// get initials
	var zipValue = zipInputEl.value.trim();
	// get localStorage item
	if (zipValue) {
		zipcodes = JSON.parse(localStorage.getItem('zipcodes'));
		// console.log(scores);
		if (!zipcodes) {
			zipcodes = [];
		};
		zipcodes.unshift(zipValue);
		console.log(zipValue)
		localStorage.setItem('zipcodes', JSON.stringify(zipcodes));
	}

	return;
}


var pastSearch = function (pastSearch) {
	console.log('past Search: ', pastSearch);
	if (pastSearch != '') { // zipcode is NOT empty
		var pastSearchEl = document.createElement('button');
		pastSearchEl.textContent = pastSearch;
		pastSearchEl.classList = 'border';
		pastSearchEl.setAttribute('data-zipcodes', pastSearch);
		pastSearchEl.addEventListener('click', searchAgain);
		pastSearchButtonEl.prepend(pastSearchEl);
	}
};

// pastSearch();
var searchAgain = function (event) {
	event.preventDefault();
	console.log(event);
	var targetZip = event.target.getAttribute('data-zipcodes');
	console.log(targetZip);
	storeContainerEl.textContent = "Loading..."
	getCoords(targetZip);

};
zipFormEl.addEventListener('submit', formSearch);
init();