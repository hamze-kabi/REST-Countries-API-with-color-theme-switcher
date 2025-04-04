"use strict";

// variables declaration
let countriesRaw;
let selectedCountry;
let countryName;
let flagImg;
let population;
let region;
let capital;
let nativeName;
let subregion;
let currencies;
let languages;
let borders;
let darkModeState;

// getting countries data from the link
async function fetchData() {
  console.log("fetchData() called")
  try {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const jsoned = await response.json()
    return jsoned  
  } catch(error) {
    console.error("failed fetching data:", error)
  }
}
// calls fetchData()
async function runFetchData() {
  console.log("runFetchData() called")
  countriesRaw = await fetchData()
  if (countriesRaw && countriesRaw.length > 1) {
    console.log("data fetched successfully")
  }
}

// extracts specifications of the country selected in index page  and dark mode state from local storage
function extractLocalStorageData() {
  console.log("extractLocalStorageData() called")
  countryName =  localStorage.getItem("countryName")
  flagImg =  localStorage.getItem("flagImg")
  population = localStorage.getItem("population")
  region =  localStorage.getItem("region")
  capital =  localStorage.getItem("capital")
  nativeName = localStorage.getItem("nativeName")
  subregion = localStorage.getItem("subregion")
  currencies = localStorage.getItem("currencies")
  languages = localStorage.getItem("languages")
  borders = localStorage.getItem("borders")
  darkModeState = localStorage.getItem("darkModeState")
  if (darkModeState == "false") {
    darkModeState = false
  } else {
    darkModeState = true
  }
}

// inserting details of selected country to their html code
function insertCountryCardDetails() {
  console.log("insertCountryCardDetails() called")
  document.getElementById("country-name").innerHTML = countryName
  document.getElementById("flag").src = flagImg
  document.getElementById("flag").alt = flagImg
  document.getElementById("native-name").innerHTML += nativeName
  document.getElementById("population").innerHTML += population
  document.getElementById("region").innerHTML += region
  document.getElementById("sub-region").innerHTML += subregion
  document.getElementById("capital").innerHTML += capital
  document.getElementById("currencies").innerHTML += currencies
  document.getElementById("languages").innerHTML += languages
  borders.split(",").forEach(border => {
    if (border == "None") {
      document.getElementById("borders").innerHTML += `<p>${border}</p>`
    } else {
      document.getElementById("borders").innerHTML += `<button class="border">${border}</button>`
    }
  })
}

// changes title of page to country name
function changePageTitle() {
  console.log("changePageTitle called")
  document.title = countryName
}

// find the selected border country from countriesRaw in order to extract its details
function findSelectedCountry(border) {
  console.log("findSelectedCountry() called")
  return countriesRaw.find(country => Object.values(country.name)[0] == border)
}

// self explainatory
function clearLocalStorage() {
  console.log("clearLocalStorage() called")
  localStorage.clear()
}

// saves details of selected border countries to local storage in order to be used in the next page
function saveDataToLocalStorage() {
  console.log("saveDataToLocalStorage() called")
  let country = selectedCountry
  try {
    nativeName = Object.values(country.name.nativeName)[0].common
  } catch(error) {
    nativeName = country.name.common
  }
  subregion = country.subregion
  if (subregion == undefined) {
    subregion = country.region
  }
  try {
    currencies = Object.values(country.currencies)[0].name
  } catch(error) {
    currencies = "none"
  }
  try {
    languages = Object.values(country.languages)      
  } catch(error) {
    languages = "none"
  }
  
  let borders = []
  if (country.borders == undefined) {
    borders = "None"
  } else {
    let bordersCca3 = country.borders
    countriesRaw.forEach(country => {
      if (bordersCca3.includes(country.cca3)) {
        borders.push(Object.values(country.name)[0])
      }
    })
  }

  countryName = country.name.common
  population = country.population // some are 0
  region = country.region
  capital = country.capital // some have more than one
  flagImg = country.flags.png

  localStorage.setItem('countryName', countryName)
  localStorage.setItem("flagImg", flagImg)
  localStorage.setItem("population", population)
  localStorage.setItem("region", region)
  localStorage.setItem("capital", capital)
  localStorage.setItem("nativeName", nativeName)
  localStorage.setItem("subregion", subregion)
  localStorage.setItem("currencies", currencies)
  localStorage.setItem("languages", languages)
  localStorage.setItem("borders", borders)
  localStorage.setItem("darkModeState", darkModeState)
  window.location.href = "country-page.html"
}

// calls a series of functions when a border country is selected
function goToBorderCountry() {
  console.log("goToBorderCountry() called")
  document.querySelectorAll(".border").forEach(border => {
    border.addEventListener("click", async function() {
      border = border.innerHTML
      clearLocalStorage()
      await runFetchData()
      selectedCountry = findSelectedCountry(border)
      saveDataToLocalStorage()
    })
  })
}

// changes style of page to dark and vice versa, wether dark mode button is clicked
// or index page is dark
function darkMode() {
  console.log("darkMode() called")
  function loadPageInDarkMode() {
    console.log("darkMode() => loadPageInDarkMode() called")
    const body = document.querySelector("body")
    const header = document.querySelector("header")
    const crescent_icon = document.getElementById("crescent-icon")
    const sun_icon = document.getElementById("sun-icon")
    const buttons = document.querySelectorAll("button")
    const goBackSection = document.getElementById("go-back-section")
    const country = document.getElementById("country")
    const botton = document.getElementById("botton")

    buttons.forEach(button => {
      button.classList.toggle("dark-button")
    })

    const elements = [body, header, crescent_icon, goBackSection, country]
    const styles = ["dark-body", "dark-header", "dark-crescent-icon", "dark-go-back-section", "dark-country"]
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.toggle(styles[i])
    }
    if (sun_icon.style.display == "") {
      sun_icon.style.display = "block"
    } else {
      sun_icon.style.display = ""
    }
  }

  if (darkModeState) {
    // changes to dark style if index page is dark
    loadPageInDarkMode()
  }
  document.getElementById("dark-mode").addEventListener("click", function() {
    // changes to dark style if dark mode button is clicked
    loadPageInDarkMode()
    if (darkModeState) {
      darkModeState = false
    } else {
      darkModeState = true
    }
  })
}

// saves darkModeState to local storage, to be used in index.html
function darkModeStateOfIndexPage() {
  console.log("darkModeStateOfIndexPage() called")
  localStorage.setItem("darkModeState", darkModeState)
}

// navigates page to index.html
function backButton() {
  console.log("backButton() called")
  document.getElementById("go-back-btn").addEventListener("click", function() {
    clearLocalStorage()
    // retains dark mode state when navigated to index page
    darkModeStateOfIndexPage()
    window.location.href = "index.html"
  })
}

// main function, starts the page
function initializePage() {
  console.log("initializePage() called")
  extractLocalStorageData()
  changePageTitle()
  insertCountryCardDetails()
  goToBorderCountry()
  backButton()
  darkMode()
}

// calling the main function
initializePage()
