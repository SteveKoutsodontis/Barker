var zipcodes = [];

var zipFormEl=document.querySelector("#zip-search-form");
var zipCodeInputEl=document.querySelector("#zipcode");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

var formSearch = function(event){
    event.preventDefault();
    var zip = zipCodeInputEl.value.trim();
    if(zip){
        zipcodes.unshift({zip});
        zipCodeInputEl.value = "";
    } else{
        alert("Please enter a zipcode");
    }
    saveSearch();
    pastSearch(zip);
}

var saveSearch = function(){
    localStorage.setItem("zipcodes", JSON.stringify(zipcodes));
};


var pastSearch = function(pastSearch){
 
    console.log(pastSearch)

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "border";
    pastSearchEl.setAttribute("data-zipcode",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchButtonEl.prepend(pastSearchEl);
}


// pastSearch();

zipFormEl.addEventListener("submit", formSearch);





