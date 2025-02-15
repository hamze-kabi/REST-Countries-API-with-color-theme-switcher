"use strict";

let countriesRaw;
let allCountries = {}
let countries = {}
let filteredCountries = null;
let resultsPerPage;
let currentPage = 1;
let searchedVal = null;

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
    initializeApp()
  }
}

/////////////////////////////////////////////////////////////////
function extractCountriesInfo() {
  console.log("extractCountriesInfo() called")
  let deconstructedCapital;
  countriesRaw.forEach(country => {
    allCountries[country.name.common] = {
      "Population": country.population, // some are 0
      "Region": country.region,
      "Capital": country.capital, // some have more than one
      "flag": country.flags.png
    }
  })
}

// if there is filtered countries object it will be referenced as countries otherwise allCountries will be
function selectCountriesObj() {
  console.log("selectCountriesObj() called")
  if (filteredCountries != null) {
    countries = filteredCountries
  } else {
    countries = allCountries
  }
}

function resetCountriesObj() {
  console.log("resetCountriesObj() called")
  countries = allCountries
  filteredCountries = null
}

function createCountryCard() {
  console.log("createCountryCard() called")
  let countryCardsContainer = document.getElementById("country-cards-container")
  Object.entries(countries).forEach(([key, value], idx) => {
    countryCardsContainer.innerHTML += 
    `<div id="${key}" class="country-card">
      <img class="flag-img" id="img-${key}" src="${value.flag}" alt="${value.flag}">
      <div id="country-card-text-box-${key}" class="country-card-text-box">
        <h3>${key}</h3>
        <p>Population: ${value.Population}</p>
        <p class="region">Region: ${value.Region}</p>
        <p>Capital: ${value.Capital}</p>
      </div>
    </div>
    `
  })
}

// number of country-cards displayed in each page equals resultsPerPage
function extractResultsPerPage() {
  console.log("extractResultsPerPage() called")
  resultsPerPage = document.getElementById("results-per-page-btn").innerText
  if (resultsPerPage == "All") {
    resultsPerPage = Object.entries(countries).length
  } 
}

// related to pages
function createPagesNumbers() {
  console.log("createPageNumbers() called")
  const pages = document.getElementById("pages")
  const numberOfPages = Math.ceil(Object.entries(countries).length/resultsPerPage)
  for (let i = 1; i <=numberOfPages; i++) {
    pages.innerHTML += `
    <button class="page-number" id="page-${i}">${i}</button>
    `
  }
}

// before each call of createPageNumbers(), this function gets called to delete previous pages numbers for new ones
function clearPageNumbers() {
  console.log("clearPagesNumbers() called")
  document.querySelectorAll(".page-number").forEach(el => el.remove())
}

// self explainatory
function selectPage() {
  console.log("selectPage() called")
  const pageNumbers = document.querySelectorAll(".page-number")
  pageNumbers.forEach(page => {
    page.addEventListener("click", function() {
      console.log("Page number selected")
      currentPage = page.innerHTML
      managePaginate("select-page")
    })
  })
}

// self explainatory
function resetCurrentPage() {
  currentPage = 1
}

// before each new display of country cards, all the country cards become diplay: none
function resetCountryCardsDisplay() {
  console.log("resetCountryCardDisplay() called")
  document.querySelectorAll(".country-card").forEach(card => {
    card.style.display = "none"
  })
}
/////////////////////////////////////////////////////////////////////////////////////////////////
// devide country cards into different pages, based on the number of results per page
function paginate() {
  let lowerLimit = (currentPage - 1) * +resultsPerPage
  let upperLimit = currentPage * +resultsPerPage  

  let i = 0
  Object.entries(countries).forEach(country => {
    if (lowerLimit <= i && i < upperLimit) {
      document.getElementById(country[0]).style.display = "block"
    }
    i++
  })
}

  // i think the reason Saint Kitts and Nevis card does not get displayed is becaise its name is consisted of several words
  // and i use their words in class
//   console.log("paginate() called")
//   let lowerLimit = (currentPage - 1) * +resultsPerPage
//   let upperLimit = currentPage * +resultsPerPage

//   if (filteredCountries != null) {
//     const countryCardsContainer = document.getElementById("country-cards-container")
//     let i = 0
//     Object.entries(countries).forEach(country => {
//       if (lowerLimit <= i < upperLimit) {
//         countryCardsContainer.querySelectorAll(`.${country[0]}`).forEach(countryCard => {
//           countryCard.style.display = "block"
//         })
//       }
//       i++
//     })
//   } else {
//     for (let i = lowerLimit; i < upperLimit; i++) {
//       try {
//         document.getElementById(`country-card-${i}`).style.display = "block"
//       } catch (error){
//         console.log(error)
//       }
//     }  
//   }
    
// }

// Saint Kitts and Nevis
// "Caribbean Netherlands"
// "Saint Barthélemy"

// following buttons when clicked dropdown drops and when clicked again, dropdown hides
function showHideDropdowns() {
  console.log("showHideDropdowns() called")
  const dropDownBtns = Array.from(document.querySelectorAll(".dropdown-btn"))
  const filterByRegionDropdownContent = Array.from(document.querySelectorAll(".filter-by-region-dropdown-content"))
  const resultsPerPageNumber = Array.from(document.querySelectorAll(".results-per-page-number"))

  const deconstructed = [
    ...dropDownBtns,
    ...filterByRegionDropdownContent,
    ...resultsPerPageNumber
  ]

  deconstructed.forEach(el => {
    el.addEventListener("click", function() {
      console.log("Dropdown button / dropdown content selected")
      // filter by region button
      if (el.id == "filter-by-region-btn" || el.classList.contains("filter-by-region-dropdown-content")) {
        const filterByRegionDropdownContentBlock = document.getElementById("filter-by-region-dropdown-content-block")
        if (getComputedStyle(filterByRegionDropdownContentBlock).height == "0px") {
          filterByRegionDropdownContentBlock.style.height = filterByRegionDropdownContentBlock.scrollHeight + 'px'
          filterByRegionDropdownContentBlock.style.padding = "0.5rem 0 0.5rem"
        } else {
          filterByRegionDropdownContentBlock.style.height = "0px"
          filterByRegionDropdownContentBlock.style.padding = "0px"
        }
      // results per page button
      } else if (el.id == "results-per-page-btn" || el.classList.contains("results-per-page-number")){
        const resultsPerPageDropdownBlock = document.getElementById("results-per-page-dropdown-block")
        if (getComputedStyle(resultsPerPageDropdownBlock).height == "0px") {
          resultsPerPageDropdownBlock.style.height = resultsPerPageDropdownBlock.scrollHeight + 'px'
          resultsPerPageDropdownBlock.style.padding = "0.5rem 0 0.5rem"
        } else {
          resultsPerPageDropdownBlock.style.height = "0px"
          resultsPerPageDropdownBlock.style.padding = "0px"
        }
      }
    })
  })
}

// rotates arrows of dropdown buttons
function rotateDropdownArrow() {
  console.log("rotateDropdownArrow() called")
  const filterByRegionArrow = document.getElementById("filter-by-region-arrow")
  const resultsPerPageArrow = document.getElementById("resultsper-page-arrow")

  // following elements when clicked filterByRegionArrow gets rotated
  const filterByRegionLi = [
    document.getElementById("filter-by-region-btn"),
      ...Array.prototype.slice.call(
        document.querySelectorAll(".filter-by-region-dropdown-content")
      )
    ]

    // following elements when clicked resultsPerPageArrow gets rotated
    const ResultsPerPageLi = [
      document.getElementById("results-per-page-btn"),
      ...Array.prototype.slice.call(
        document.querySelectorAll(".results-per-page-number")
      )
    ]

  // rotates filterByRegionArrow
  filterByRegionLi.forEach(el => {
    el.addEventListener("click", function() {
      console.log("filter by region button / content selected")
      filterByRegionArrow.classList.toggle("dropdown-arrow-rotate")
    })
  })

  // rotates resultsPerPageArrow
  ResultsPerPageLi.forEach(el => {
    el.addEventListener("click", function() {
      console.log("results per page button / content selected")
      resultsPerPageArrow.classList.toggle("dropdown-arrow-rotate")
    })
  })  
}

function selectFilterByRegionContent() {
  console.log("selectFilterByRegionContent() called")
  let dropdownContent = document.querySelectorAll(".filter-by-region-dropdown-content")
  let filterByRegionBtnText = document.getElementById("filter-by-region-btn-text")
  dropdownContent.forEach(content => {
    content.addEventListener("click", function() {
      console.log("filter by region content selected")
      if (content.innerHTML == "Remove filter") {
        filterByRegionBtnText.innerHTML = "Filter by region"
      } else {
        filterByRegionBtnText.innerHTML = content.innerHTML
      }
      managePaginate("change-filter-by-region")
    })
  })
}


function selectResultsPerPageContent() {
  console.log("selectResultsPerPageContent() called")
  const resultsPerPageNumber = document.querySelectorAll(".results-per-page-number")
  const resultsPerPageBtnText = document.getElementById("results-per-page-btn-text")
  resultsPerPageNumber.forEach(content => {
    content.addEventListener("click", function() {
      console.log("results per page content selected")
      resultsPerPageBtnText.innerHTML = content.innerHTML
      managePaginate("change-results-per-page")
    })
  })
}

// extract countries based on the regions
function extractCountriesByRegion() {
  console.log("extractCountriesByRegion() called")
  if (filteredCountries != null) {
    resetCountriesObj()
  }
  let region = document.getElementById("filter-by-region-btn-text").innerHTML
  if (region == "Filter by region") {
    filteredCountries = countries
  } else {
    filteredCountries = Object.keys(countries).filter(key => countries[key]["Region"] == region)
    filteredCountries = filteredCountries.reduce((obj, key) => {
      obj[key] = countries[key]
      return obj
    }, {})
  }
}

// calculates total number of results
function totalNumberOfResults() {
  console.log("totalNumberOfResults() called")
  let totalNumber = Object.entries(countries).length
  const totalNumberEl = document.getElementById("total-number")
  totalNumberEl.innerHTML = totalNumber
}

function extractSearch() {
  let searchField = document.getElementById("search-field")
  searchField.addEventListener("input", function() {
    searchedVal = searchField.value.toLowerCase()
    managePaginate("search")
  })
}

// search function
function extractCountriesBySearchedVal() {
  resetCountriesObj()
  filteredCountries = {}
  Object.entries(allCountries).forEach(country => {
    if (country[0].toLowerCase().includes(searchedVal)) {
      filteredCountries[country[0]] = country[1]
    }
  })
}

// createCountryCard()
// extractResultsPerPage()
// createPagesNumbers()
// clearPageNumbers()
// selectPage()
// resetCountryCardsDisplay()
// paginate()
// selectResultsPerPageContent()
// selectFilterByRegionContent()

function managePaginate(state="") {
  console.log("managePaginate() called")
  if (state == "start") {
    console.log("managePaginate(state=), state = start")
    selectCountriesObj()
    extractResultsPerPage()
    clearPageNumbers()
    createPagesNumbers()
    resetCountryCardsDisplay()
    createCountryCard()
    paginate()
    totalNumberOfResults()
  } else if (state == "select-page") {
    console.log("managePaginate(state=), state = select-page")
    resetCountryCardsDisplay()
    extractResultsPerPage()
    paginate()
  } else if (state == "change-results-per-page") {
    console.log("managePaginate(state=), state = change-results-per-page")
    resetCountryCardsDisplay()
    clearPageNumbers()
    extractResultsPerPage()
    createPagesNumbers()
    resetCurrentPage()
    paginate()
    selectPage()
  } else if (state == "change-filter-by-region") {
    console.log("managePaginate(state=), state = change-filter-by-region")
  // createCountryCard()
  // extractResultsPerPage()
  // createPagesNumbers()
  // clearPageNumbers()
  // selectPage()
  // resetCountryCardsDisplay()
  // paginate()
  // selectResultsPerPageContent()
  // selectFilterByRegionContent()

    resetCountryCardsDisplay()
    clearPageNumbers()
    extractCountriesByRegion()
    extractResultsPerPage()
    selectCountriesObj()
    createPagesNumbers()
    resetCurrentPage()
    selectPage()
    paginate()
    totalNumberOfResults()
    // console.log(currentPage)
    // resetCountriesObj()
  } else if (state == "search") {
    console.log("managePaginate(state=), state = search")
    resetCountryCardsDisplay()
    clearPageNumbers()
    extractCountriesBySearchedVal()
    extractResultsPerPage()
    selectCountriesObj()
    createPagesNumbers()
    resetCurrentPage()
    selectPage()
    paginate()
    totalNumberOfResults()
    // resetCountryCardsDisplay()
    // clearPageNumbers()
    // extractResultsPerPage()
    // selectCountriesObj()
  }
}

// all the functions get nested inside initializeApp()
function initializeApp() {
  console.log("initializeApp() called")
  extractCountriesInfo()
  createCountryCard()

  managePaginate("start")
  selectPage()
  // extractResultsPerPage()
  // createPagesNumbers()
  // selectPage()
  // paginate()

  rotateDropdownArrow()
  showHideDropdowns()
  selectFilterByRegionContent()
  selectResultsPerPageContent()
  extractSearch()
}

// start app
runFetchData()
