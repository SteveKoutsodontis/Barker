console.log("index.js is running")
var zipcodes = [];

var zipFormEl = document.querySelector("#zip-search-form");
var zipCodeInputEl = document.querySelector("#zip-input");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");
var zipButtonEl = document.querySelector("#search")
console.log(zipcodes);
var formSearch = function (event) {
    event.preventDefault();
    var zip = zipCodeInputEl.value.trim();
    if (zip) {
        zipcodes.unshift({ zip });
        zipCodeInputEl.value = "";
    }
    //  else {
    //     alert("Please enter a zipcode");
    // }
    saveSearch();
    pastSearch(zip);
}
console.log(zip)
console.log(pastSearch)
var saveSearch = function () {
    localStorage.setItem("zipcodes", JSON.stringify(zip));
};
console.log(localStorage)

var pastSearch = function (pastSearch) {

    console.log(pastSearch)

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "border";
    pastSearchEl.setAttribute("data-zipcode", pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchButtonEl.prepend(pastSearch);
}


// pastSearch();

zipFormEl.addEventListener("click", formSearch);





