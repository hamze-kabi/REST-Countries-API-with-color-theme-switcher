"use strict";

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

async function runFetchData() {
  console.log("runFetchData() called")
  countriesRaw = await fetchData()
  if (countriesRaw && countriesRaw.length > 1) {
    console.log("data fetched successfully")
  }
}

function extractLocalStorageData() {
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
}


function insertCountryCardDetails() {
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

function findSelectedCountry(border) {
  return countriesRaw.find(country => country.cca3 == border)
}

function clearLocalStorage() {
  localStorage.clear()
}


function saveDataToLocalStorage() {
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
  if (country.borders == undefined) {
    borders = "None"
  } else {
    borders = country.borders
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
  window.location.href = "country-page.html"
}

function goToBorderCountry() {
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

extractLocalStorageData()
insertCountryCardDetails()
goToBorderCountry()

