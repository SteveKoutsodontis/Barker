document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('select');
	var options = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems);
});

var findBreedsBtn = document.querySelector('#find-breeds'); // button after user selects temperaments  
var tempsSelectedEl = document.querySelector('#temperaments'); // the dropdown menu of temperaments 
var showBreedBtn = document.querySelector('#show-breed'); // button to click after breed is selected 
var selectedBreedEl = document.querySelector('#breeds'); // dropdown of breeds 
var breedDisplayEl = document.querySelector('#display-breed'); // container where dog breed info is displayed.  Image, facts, etc. 
var hackBreed = 0;
var instance;
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.modal');
	instance = M.Modal.init(elems)[0];
});
var modalText = document.querySelector('#modal-p');

function displayModal(displayText) {
	modalText.textContent = displayText;
	instance.open();
}

var saveData; // saving the API data from the original fetch call because API doesn't return an image of the dog when asking for the breed info

// findBreedClickHandler is called when the button under the temperament list is called.
function findBreedClickHandler(event) {
	// make array of temperaments that were clicked
	var userTemps = [];

	// instance.open();// practice modal
	for (var option of tempsSelectedEl.options) {
		if (option.selected && option.value != '') {
			userTemps.push(option.value);
		}
	}
	// If by chance there were no traits selected, just return
	if (userTemps.length === 0) {
		displayModal('Please select up to 3 traits');
		return;
	}
	matchingBreeds = matchUserTemps(userTemps);
}

//showBreedClickHandler is called when the button under the selected Breed is called.
function showBreedClickHandler(event) {
  var breedSelected = [];

  //  sometimes the dropdown just doesn't work and we get a negative selection.
  if (selectedBreedEl.selectedIndex >= 0) {
    breedSelected = selectedBreedEl.options[selectedBreedEl.selectedIndex].text;
    console.log('ShowBreedClickHandler: ' + breedSelected + ' ' + selectedBreedEl.selectedIndex);

    var breedSelected = [];
    breedSelected = selectedBreedEl.options[selectedBreedEl.selectedIndex].value;


    getBreedInfo(breedSelected);
  }
  else { 
    displayModal("No Breed Selected.")
  }
}

// fetches info from dog breed and displays it.
function fetchBreedInfo(breedSelected, curBreedInfo) {
  var dogUrl = 'https://api.thedogapi.com/v1/breeds/search?q=' + breedSelected;


  fetch(dogUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {

          // remove old info from display-breed div

          while (breedDisplayEl.firstChild) {
            breedDisplayEl.removeChild(breedDisplayEl.firstChild);
          }
          displayBreedInfo(curBreedInfo);
        });
      } else {
        displayModal('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      displayModal('Unable to connect to TheDogAPI');
    });
}

function displayBreedInfo(displayBreedData) {
  // Fill out <div> with info
  var img = document.createElement('img');
  img.setAttribute('src', displayBreedData.image.url);
  img.setAttribute('height', '300');
  img.setAttribute('width', '300');
  //  element.setAttribute(value);
  var dogNameEl = document.createElement("h5");
  var dogWeightEl = document.createElement("h5");
  var dogHeightEl = document.createElement("h5");
  var dogBred_ForEl = document.createElement("h5");
  var dogBreed_GroupEl = document.createElement("h5");
  var dogLife_SpanEl = document.createElement("h5");
  var dogTemperamentEl = document.createElement("h5");
  var dogOriginEl = document.createElement("h5");

  var dogName = displayBreedData.name
  var dogWeight = displayBreedData.weight.imperial;
  var dogHeight = displayBreedData.height.imperial;
  var dogBred_For = displayBreedData.bred_for;
  var dogBreed_Group = displayBreedData.breed_group;
  var dogLife_Span = displayBreedData.life_span;
  var dogTemperament = displayBreedData.temperament;
  var dogOrigin = displayBreedData.origin;


  dogNameEl.textContent = dogName;
  dogWeightEl.textContent = "Weight: " + dogWeight + " lbs";
  dogHeightEl.textContent = "Height: " + dogHeight + " inches";
  dogBred_ForEl.textContent = "Bred for: " + dogBred_For;
  dogBreed_GroupEl.textContent = "Breed Group: " + dogBreed_Group;
  dogLife_SpanEl.textContent = "Life Span: " + dogLife_Span;
  dogTemperamentEl.textContent = "Temperament: " + dogTemperament;
 
  dogNameEl.innerHTML = `<span class = "bold">Breed Name: </span> ${dogName}`
  dogWeightEl.innerHTML = `<span class = "bold"> Weight: </span> ${dogWeight} lbs `
  dogHeightEl.innerHTML = `<span class = "bold"> Height: </span> ${dogHeight} inches `
  dogBred_ForEl.innerHTML = `<span class = "bold"> Bred for: </span> ${dogBred_For}`
  dogBreed_GroupEl.innerHTML = `<span class = "bold"> Breed Group: </span> ${dogBreed_Group}`
  dogLife_SpanEl.innerHTML = `<span class = "bold"> Life Span: </span> ${dogLife_Span}`
  dogTemperamentEl.innerHTML = `<span class = "bold"> Temperament: </span> ${dogTemperament}`

  breedDisplayEl.appendChild(img);
  breedDisplayEl.appendChild(dogNameEl);
  breedDisplayEl.appendChild(dogWeightEl);
  breedDisplayEl.appendChild(dogHeightEl);
  breedDisplayEl.appendChild(dogBred_ForEl);
  breedDisplayEl.appendChild(dogBreed_GroupEl);
  breedDisplayEl.appendChild(dogLife_SpanEl);
  breedDisplayEl.appendChild(dogTemperamentEl);

  if (dogOrigin !== undefined) {
    dogOriginEl.textContent = "Origin: " + dogOrigin;
    breedDisplayEl.appendChild(dogOriginEl);
  }
}

// fetches info from database about the selected dog Breed
function getBreedInfo(selectedBreed) {
	if (saveData) {
		console.log('selectedBreed: ' + selectedBreed);
		for (let i = 0; i < saveData.length; i++) {
			if (saveData[i].name === selectedBreed) {
				var curBreedInfo = saveData[i];
			}
		}
	}

	// For some reason, the API doesn't return an image when you fetch the breed info so rather than do another call, we are using the saved info from before.
	// Get the breed's information and display it.
	fetchBreedInfo(selectedBreed, curBreedInfo);
}

// returns true if ALL of the temperaments in userTemps are also in breedTemps
function findMatch(userTemps, breedTemps) {
	var foundMatch = true;

	// for each userTemp, check to see if it's in the breedTemps.
	// if one of the userTemps is not in the breed Temps, return false
	// only look at first 3 temperaments
	var numTemps = Math.min(3, userTemps.length);

	for (let i = 0; i < numTemps; i++) {
		if (!foundMatch) {
			// didn't find match for last userTemp so return
			return false;
		}

		foundMatch = false; // haven't found match with this userTemps yet
		for (let j = 0; j < breedTemps.length; j++) {
			if (userTemps[i] === breedTemps[j]) {
				foundMatch = true;
			}
		}
	}
	return foundMatch;
}

// Given an array of temperaments
// find a breed that matches those temperaments

function matchTemperamentWithBreed(userTemperaments, curBreed) {
	var curTemp; // array of temperaments of current breed

	curTemp = curBreed.temperament;

	// grab string list of temperaments and put them in an array
	if (!curTemp) {
		// no temperaments listed for this breed
		return null;
	}

	var curTempArray = curTemp.split(',');
	// remove leading or trailing spaces
	for (let i = 0; i < curTempArray.length; i++) {
		curTempArray[i] = curTempArray[i].trim();
	}

	//Check to see if the user's temperament matches one of the breed's temperaments
	let foundMatch = findMatch(userTemperaments, curTempArray);

	if (foundMatch) {
		return curBreed.name;
	} else return null;
}

// Builds an array of breed names whose temperaments match the input temperaments
function findBreedsWithTemperaments(temperaments, data) {
	// go through all breeds and build a list of breeds that have matching temperaments.
	var matchingBreeds = [];
	// Look through breeds to see if any have all the temperaments.
	for (index = 0; index < data.length; index++) {
		breedMatches = matchTemperamentWithBreed(temperaments, data[index]);
		if (breedMatches != null) {
			//this breed matched the temperaments.  Add to list
			matchingBreeds.push(breedMatches);
		}
	}

	return matchingBreeds;
}

// Given an array of temperaments, requests list of breeds from the API and then matches the temperaments to populate the breeds list
function matchUserTemps(temperaments) {
  var dogUrl = 'https://api.thedogapi.com/v1/breeds?attach_breed=0?da345f76-e541-4a86-97b1-75573d24c717';

  fetch(dogUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {

          //now that we have our list of breeds, go through the list and match the temperament(s) that the user gave us.  Return the list of breeds that contain those temperaments.
          matchingBreeds = findBreedsWithTemperaments(temperaments, data);


          saveData = data;



          if (matchingBreeds.length === 0) {
            //  display modal that says no matches
            displayModal("Sorry, there aren't any breeds with all of those characteristics.  Please try again");

            console.log('matchingBreeds is null in MatchUsrTmps');
            return null;
          }

          // remove any previous options from the breedlist first

          while (selectedBreedEl.options.length > 0) {
            selectedBreedEl.remove(0);
          }
          // Populate the breeds dropdown
          for (i = 0; i < matchingBreeds.length; i++) {

            let selectArea = document.getElementById("breeds");
            selectArea.add(new Option(matchingBreeds[i], matchingBreeds[i]))
            var instance = M.FormSelect.init(document.querySelectorAll('select'))
          }

          //AFTER EVERY BREED IS APPENDED, we reveal the select tool
          document.getElementById("breedChoice").setAttribute("class", "input-field col s12")

          return matchingBreeds;
        });
      } else {
       displayModal('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
     displayModal('Unable to connect to TheDogAPI');
    });
}

findBreedsBtn.addEventListener('click', findBreedClickHandler);
showBreedBtn.addEventListener('click', showBreedClickHandler);


