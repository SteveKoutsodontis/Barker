console.log("katie.js is running")

var userFormEl = document.querySelector('#user-form');
var zipInputEl = document.querySelector('#zip-input');
//box they enter the zipcode into
var zipButtonEl = document.querySelector('#zip-button')
//button to search zipcode
var storeContainerEl = document.querySelector('#store-container');
//area the store will be displayed

var formSubmitHandler = function (event) {
    event.preventDefault();
    console.log("formsubmit")
    //gets the zipcode from the zipInputEl
    var zipcode = zipInputEl.value.trim();
    console.log("zipcode" + zipcode)
    if (zipcode) {
        getCoords(zipcode);//getCoords uses the zipcode function
        storeContainerEl.textContent = '';
        zipInputEl.value = '';
    }
};

// var buttonClickHandler = function (event) {
//     var language = event.target.getAttribute('data-language');
//     if (language) {
//         getStores(language);
//         storeContainerEl.textContent = '';
//     }
//uses the zipcode results to get the lat/long 
var getCoords = function (zipcode) {
    var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCYO2vxRIUA51sE3nmmVld6f-n0OMzk80c&components=postal_code:' + zipcode;
    console.log("apiUrl" + apiUrl);
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data)
                    console.log(data.results[0].geometry.location.lat);
                    console.log(data.results[0].geometry.location.lng);
                    findStore(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
                });
            } else {
            }
        })
        .catch(function (error) {
        });
};

var showStore = function (store) {
    console.log(store);
    var storeName = store.City;
    var storeEl = document.createElement('p');
    storeContainerEl.appendChild(storeEl);
    storeEl.textContent = storeName;
console.log(storeName);
    // if (store.length === 0) {
    //     storeContainerEl.textContent = "No stores found.";
    //     return;
    // }
    // for (var i = 0; i < store.length; i++) {
    //     // var storeName = store[i].owner.login + '/' + repos[i].name;
    //     var storeName = store[i].StoreSearchResults[0].Store.City;
    //     
    //     // storeEl.classList = 'list-item flex-row justify-space-between align-center';
    //     // storeEl.setAttribute("innerText" , storeName);
    //     storeEl.textContent = storeName;
    //     
    //     console.log(storeName);

    //     //     var titleEl = document.createElement('span');{
    //     //     
    //     // }
    // }
}


//inputs the lat/long from getCoords to find a pet smart location
var findStore = function (lat, lng) {
    // var apiUrlPet = 'https://cors-anywhere.herokuapp.com/https://api.petsmart.com/v1/search/stores?model.latitude=39.8649819&model.longitude=-75.07512410000001';
    var apiUrlPet = 'https://cors-anywhere.herokuapp.com/https://api.petsmart.com/v1/search/stores?model.latitude=' + lat + '&model.longitude=' + lng;
    console.log("apiUrlPet" + apiUrlPet);
    console.log('findStore' + lat + lng)
    fetch(apiUrlPet)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                    console.log(data.StoreSearchResults[0].Store.City);
                    console.log(data.StoreSearchResults[0].Store.PhoneNumber);
                showStore(data.StoreSearchResults[0].Store);
                })
                
            }
            

        })
    }
    zipButtonEl.addEventListener('click', formSubmitHandler);