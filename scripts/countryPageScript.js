"use strict";

let countryName =  localStorage.getItem("countryName")
let flagImg =  localStorage.getItem("flagImg")
let population = localStorage.getItem("population")
let region =  localStorage.getItem("region")
let capital =  localStorage.getItem("capital")
let nativeName = localStorage.getItem("nativeName")
let subregion = localStorage.getItem("subregion")
let currencies = localStorage.getItem("currencies")
let languages = localStorage.getItem("languages")
let borders = localStorage.getItem("borders")

//////////////// complete borders
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
    document.getElementById("borders").innerHTML += `<button class="border">${border}</button>`
  })
}

function goToBorderCountry() {
  document.querySelectorAll(".border").forEach(border => {
    border.addEventListener("click", function() {
      console.log(border)
    })
  })
}

insertCountryCardDetails()
goToBorderCountry()