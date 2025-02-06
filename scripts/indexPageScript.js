"use strict";

let countriesRaw;
let countries = {}
let resultsPerPage;
let currentPage = 1;

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
  extractResultsPerPage()
  createCountryCard()
  createPagesNumbers()
  selectPage()
  paginate()
  rotateDropdownArrow()
  showHideDropdowns()
  selectFilterByRegionContent()
  selectResultsPerPageContent()
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
}

// number of country-cards displayed in each page equals resultsPerPage
function extractResultsPerPage() {
  resultsPerPage = document.getElementById("results-per-page-btn").innerText
}

function createCountryCard() {
  let countryCardsContainer = document.getElementById("country-cards-container")
  Object.entries(countries).forEach(([key, value], idx) => {
    countryCardsContainer.innerHTML += 
    `<div id="country-card-${idx}" class="country-card">
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
}


// related to pages
function createPagesNumbers() {
  const pages = document.getElementById("pages")
  const numberOfPages = Math.ceil(Object.entries(countries).length/resultsPerPage)
  for (let i = 1; i <=numberOfPages; i++) {
    pages.innerHTML += `
    <button class="page-number" id="page-${i}">${i}</button>
    `
  }
}

// self explainatory
function selectPage() {
  const pageNumbers = document.querySelectorAll(".page-number")
  pageNumbers.forEach(page => {
    page.addEventListener("click", function() {
      currentPage = page.innerHTML
      paginate()
    })
  })
}

// before each new display of country cards, all the country cards become diplay: none
function resetCountryCardsDisplay() {
  document.querySelectorAll(".country-card").forEach(card => {
    card.style.display = "none"
  })
}

// devide country cards into different pages, based on the number of results per page
function paginate() {
  resetCountryCardsDisplay()
  let lowerLimit = (currentPage - 1) * +resultsPerPage
  let upperLimit = currentPage * +resultsPerPage
  for (let i = lowerLimit; i < upperLimit; i++) {
    document.getElementById(`country-card-${i}`).style.display = "block"
  }
}

// following buttons when clicked dropdown drops and when clicked again, dropdown hides
function showHideDropdowns() {
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
      filterByRegionArrow.classList.toggle("dropdown-arrow-rotate")
    })
  })

  // rotates resultsPerPageArrow
  ResultsPerPageLi.forEach(el => {
    el.addEventListener("click", function() {
      resultsPerPageArrow.classList.toggle("dropdown-arrow-rotate")
    })
  })  
}

function selectFilterByRegionContent() {
  let dropdownContent = document.querySelectorAll(".filter-by-region-dropdown-content")
  let filterByRegionBtnText = document.getElementById("filter-by-region-btn-text")
  dropdownContent.forEach(content => {
    content.addEventListener("click", function() {
      if (content.innerHTML == "Remove filter") {
        filterByRegionBtnText.innerHTML = "Filter by region"
      } else {
        filterByRegionBtnText.innerHTML = content.innerHTML
      }
    })
  })
}

////////////////////////////////////////////////////////////////////////////////// fix it
function selectResultsPerPageContent() {
  console.log(444444444444)
  const resultsPerPageNumber = document.querySelectorAll(".results-per-page-number")
  const resultsPerPageBtnText = document.getElementById("results-per-page-btn-text")
  resultsPerPageNumber.forEach(content => {
    content.addEventListener("click", function() {
      resultsPerPageBtnText.innerHTML = content.innerHTML
    })
  })
  let els = document.querySelectorAll(".country-card")
  let yo = false
  els.forEach(el => {
    if (el.style.display == "block") {
      yo = true
    }
  })
  console.log(yo)
}

// start app
runFetchData()
