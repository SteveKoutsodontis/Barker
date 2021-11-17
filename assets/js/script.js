document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  var options = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});

var findBreedsBtn = document.querySelector('#find-breeds'); // button after user selects temperaments  TODO: change to Project's ID
var tempsSelectedEl = document.querySelector('#temperaments'); // the dropdown menu of temperaments TODO: change to project's ID
var showBreedBtn = document.querySelector('#show-breed'); // button to click after breed is selected TODO: change to project's ID
var selectedBreedEl = document.querySelector('#breeds'); // dropdown of breeds TODO: change to project's ID
var breedDisplayEl = document.querySelector('#display-breed'); // container where dog breed info is displayed.  Image, facts, etc. TODO change to project's ID

var saveData; // saving the API data from the original fetch call because API doesn't return an image of the dog when asking for the breed info

// findBreedClickHandler is called when the button under the temperament list is called.
function findBreedClickHandler(event) {
  // make array of temperaments that were clicked
  var userTemps = [];
  for (var option of tempsSelectedEl.options) {
    if (option.selected) {
      userTemps.push(option.value);
    }
  }

  matchingBreeds = matchUserTemps(userTemps);
}

//showBreedClickHandler is called when the button under the selected Breed is called.
function showBreedClickHandler(event) {
  var breedSelected = [];
debugger;
  breedSelected = selectedBreedEl.options[selectedBreedEl.selectedIndex].value;
  console.log('ShowBreedClickHandler: ' + breedSelected);

  getBreedInfo(breedSelected);
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
            el.removeChild(el.firstChild);
          }
          // Fill out <div> with info
          var img = document.createElement('img');
          img.setAttribute('src', curBreedInfo.image.url);
          img.setAttribute('height', '300');
          img.setAttribute('width', '300');

          // TODO: Add the image to the appropriate container
          breedDisplayEl.appendChild(img);





        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to TheDogAPI');
    });
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

  // Look through first hundred and fifty breeds to see if any have all the temperaments.
  for (index = 0; index < 15; index++) {
    breedMatches = matchTemperamentWithBreed(temperaments, data[index]);
    console.log(temperaments + data[index].name+breedMatches);
    if (breedMatches != null) {
      console.log(breedMatches)
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
          console.log(temperaments)
          //now that we have our list of breeds, go through the list and match the temperament(s) that the user gave us.  Return the list of breeds that contain those temperaments.
          matchingBreeds = findBreedsWithTemperaments(temperaments, data);

          console.log(data)
          saveData = data;

          //breed Populating portion!
            for(i=0; i<data.length; i++){
              //creating a new option element that will eventually be appended to the select element in the HTML
              // var newOption = document.createElement("option");
              //Assigning the value and text for the new element to match the breed that we found through the API
              // newOption.setAttribute("value", data[i].name)
              // newOption.textContent = data[i].name

              //appending all options to the select HTML element
              // document.getElementById("breeds").appendChild(newOption)

              let selectArea = document.getElementById("breeds")
              // console.log(selectArea);

              selectArea.add(new Option(data[i].name, data[i].name))

              var instance = M.FormSelect.init(document.querySelectorAll('select'))
              // instance.getSelectedValues()
            }

            //AFTER EVERY BREED IS APPENDED, we reveal the select tool
            document.getElementById("breedChoice").setAttribute("class", "input-field col s12")
          //END OF PORTION


           // Fill out <div> with info
           var img = document.createElement('img');
           img.setAttribute('src', "https://cdn2.thedogapi.com/images/BJa4kxc4X.jpg");
           img.setAttribute('height', '300');
           img.setAttribute('width', '300');
          //  element.setAttribute(value);
          var dogNameEl = document.createElement("h6");
          var dogWeightEl = document.createElement("h6");
          var dogHeightEl = document.createElement("h6");
          var dogBred_ForEl = document.createElement("h6");
          var dogBreed_GroupEl = document.createElement("h6");
          var dogLife_SpanEl = document.createElement("h6");
          var dogTemperamentEl = document.createElement("h6");
          var dogOriginEl = document.createElement("h6");

          var dogName = data[0].name
          var dogWeight = data[0].weight.imperial;
          var dogHeight = data[0].height.imperial;
          var dogBred_For = data[0].bred_for;
          var dogBreed_Group = data[0].breed_group;
          var dogLife_Span = data[0].life_span;
          var dogTemperament = data[0].temperament;
          var dogOrigin = data[0].origin;

          dogNameEl.textContent = dogName
          dogWeightEl.textContent = "Weight: " + dogWeight + " lbs"
          dogHeightEl.textContent = "Height: " + dogHeight + " inches"
          dogBred_ForEl.textContent = "Bred for: " +  dogBred_For  
          dogBreed_GroupEl.textContent = "Breed Group: " + dogBreed_Group
          dogLife_SpanEl.textContent = "Life Span: " + dogLife_Span
          dogTemperamentEl.textContent = "Termperament: " + dogTemperament
          dogOriginEl.textContent = "Origin: " + dogOrigin

           // TODO: Add the image to the appropriate container
           breedDisplayEl.appendChild(img);
          breedDisplayEl.appendChild(dogNameEl);
          breedDisplayEl.appendChild(dogWeightEl);
          breedDisplayEl.appendChild(dogHeightEl);
          breedDisplayEl.appendChild(dogBred_ForEl);
          breedDisplayEl.appendChild(dogBreed_GroupEl);
          breedDisplayEl.appendChild(dogLife_SpanEl);
          breedDisplayEl.appendChild(dogTemperamentEl);
          breedDisplayEl.appendChild(dogOriginEl);
          
          
          if (matchingBreeds == null) {
            // TODO display modal that says no matches
            console.log('matchingBreeds is null in MatchUsrTmps');
            return null;
          }

          // remove any previous options from the breedlist first

          while (selectedBreedEl.options.length > 0) {
            selectedBreedEl.remove(0);
          }
          // TODO: is there a Materialize way to do this?
          for (i = 0; i < matchingBreeds.length; i++) {
            let opt = document.createElement('option');
            opt.text = matchingBreeds[i];
            opt.value = matchingBreeds[i];
            selectedBreedEl.options.add(opt);
          }
          return matchingBreeds;
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to TheDogAPI');
    });
}

findBreedsBtn.addEventListener('click', findBreedClickHandler);
showBreedBtn.addEventListener('click', showBreedClickHandler);
