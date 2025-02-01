"use strict";

let countriesRaw;
let countries = {}

async function fetchData() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const jsoned = await response.json()
    return jsoned  
  } catch(error) {
    console.error("failed fetching data:", error)
  }
}

async function runFetchData() {
  countriesRaw = await fetchData()
  if (countriesRaw && countriesRaw.length > 1) {
    console.log("data fetched successfully")
    initializeApp()
  }
}

// all the functions get nested inside initializeApp()
function initializeApp() {
  extractCountriesInfo()
}

function extractCountriesInfo() {
  countriesRaw.forEach(country => {
    countries[country.name.common] = {
      "Population": country.population, // some are 0
      "Region": country.region,
      "Capital": country.capital, // some have more than one
      "flag": country.flags.png
    }
  })
  createCountryCard()
}

function createCountryCard() {
  let countryCardsContainer = document.getElementById("country-cards-container")
  Object.entries(countries).forEach(([key, value], idx) => {
    countryCardsContainer.innerHTML += 
    `<div id="${key}" class="country-card">
      <img class="flag-img" id="img-${key}" src="${value.flag}" alt="${value.flag}">
      <div id="country-card-text-box-${key}" class="country-card-text-box">
        <h3>${key}</h3>
        <p>Population: ${value.Population}</p>
        <p>Region: ${value.Region}</p>
        <p>Capital: ${value.capital}</p>
      </div>
    </div>
    `
  })
  showHideDropdowns()
  rotateDropdownArrow()
}

// following buttons when clicked dropdown drops and when clicked again, dropdown hides
function showHideDropdowns() {
  const dropdownBtn = document.querySelectorAll(".dropdown-btn")
  dropdownBtn.forEach(dropdownBtn => {
    dropdownBtn.addEventListener("click", function() {
      const dropdownContent = dropdownBtn.parentElement.querySelector(".dropdown-content")
      const dropdownContentStyle = getComputedStyle(dropdownContent)
      if (dropdownContentStyle.height === '0px' || dropdownContentStyle.height === '') {
        dropdownContent.style.height = dropdownContent.scrollHeight + 'px';
    } else {
        dropdownContent.style.height = '0px';
    }
    if (dropdownContentStyle.padding == "0px" || dropdownContentStyle.padding == "") {
      dropdownContent.style.padding = "0.5rem 0 0.5rem"
    } else {
      dropdownContent.style.padding = "0px"
    }
    })
  })
}

// .dropdwon-btn-svg rotates 180 degrees with each click
function rotateDropdownArrow() {
  const dropdownBtns = document.querySelectorAll(".dropdown-btn")
  dropdownBtns.forEach(dropdownBtn => {
    dropdownBtn.addEventListener("click", function() {
      const dropDownArrow = dropdownBtn.querySelector(".dropdown-arrow")
      dropDownArrow.classList.toggle("dropdown-arrow-rotate")
    })
  })
}

// start app
runFetchData()
