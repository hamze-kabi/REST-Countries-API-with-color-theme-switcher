"use strict";

// variables decleration
let countriesRaw; // the first, raw downloaded countries data
// countains all countries, with some specific inforation of each country, gets populated in extractCountriesInfo()
let allCountries = {}
// if a filter is applied by user(search a country name, filtering by region), the resluting countries,
// populate filteredCountries, otherwise it is remain null
let filteredCountries = null;
// the to be used countries in later function, whether filteredCountries(if not null), or allCountries
let countries = {}
let resultsPerPage;
let currentPage = 1;
let searchedVal = null; // value written in search field
let NumberOfPageButtons = 3
let darkModeState = false

// gets countries data from the link
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

// calls fetchData() and intializeApp(), whenever countries data is ready, intializeApp() is called
async function runFetchData() {
  console.log("runFetchData() called")
  countriesRaw = await fetchData()
  if (countriesRaw && countriesRaw.length > 1) {
    console.log("data fetched successfully")
    initializeApp()
  }
}

// extracts specific inforamtion related to each country from the main countries data
function extractCountriesInfo() {
  console.log("extractCountriesInfo() called")
  countriesRaw.forEach(country => {
    let nativeName;
    try {
      nativeName = Object.values(country.name.nativeName)[0].common
    } catch(error) {
      nativeName = country.name.common
    }
    let subRegion = country.subregion
    if (subRegion == undefined) {
      subRegion = country.region
    }

    let currencies;
    try {
      currencies = Object.values(country.currencies)[0].name
    } catch(error) {
      currencies = "none"
    }

    let languages;
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

    allCountries[country.name.common] = {
      "Population": country.population, // some are 0
      "Region": country.region,
      "Capital": country.capital, // some have more than one
      "flag": country.flags.png,
      "nativeName": nativeName,
      "subregion": subRegion,
      "currencies": currencies,
      "languages": languages,
      "borders": borders
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

// filteredCuntries becomes null, and countries become allCountries
function resetCountriesObj() {
  console.log("resetCountriesObj() called")
  countries = allCountries
  filteredCountries = null
}

// country cards in the index.html, gets created dynamically, by adding related html codes, along with
// information from countries object
function createCountryCard() {
  console.log("createCountryCard() called")
  let countryCardsContainer = document.getElementById("country-cards-container")
  Object.entries(countries).forEach(([key, value], idx) => {
    countryCardsContainer.innerHTML += 
    `<div id="${key}" class="country-card">
      <img class="flag-img" id="img-${key}" src="${value.flag}" alt="${value.flag}">
      <div id="country-card-text-box-${key}" class="country-card-text-box">
        <h3>${key}</h3>
        <div class="country-card-info">Population: <p class="population" >${value.Population}</p></div>
        <div class="country-card-info">Region: <p class="region">${value.Region}</p></div>
        <div class="country-card-info">Capital: <p class="capital">${value.Capital}</p></div>
        <p class="nativeName">${value.nativeName}</p>
        <p class="subregion">${value.subregion}</p>
        <p class="currencies">${value.currencies}</p>
        <p class="languages">${value.languages}</p>
        <p class="borders">${value.borders}</p>
      </div>
    </div>
    `
  })
}


// changes style of pages from light to dark and vice versa, whech dark mode button is clicked
function darkMode() {
  console.log("darkMode() called")
  darkModeState = localStorage.getItem("darkModeState")
  if (darkModeState == "true") {
    darkModeState = true
  } else {
    darkModeState = false
  }
  if (darkModeState) {
    applyDarkModeState()
  }

  function applyDarkModeState() {
    console.log("darkMode() => applyDarkModeState() called")
    const body = document.querySelector("body")
    const header = document.querySelector("header")
    const crescent_icon = document.getElementById("crescent-icon")
    const sun_icon = document.getElementById("sun-icon")
    const searchFilterSection = document.getElementById("search-filter-section")
    const country_cards_container = document.getElementById("country-cards-container")
    const search_section = document.getElementById("search-section")
    const search_field = document.getElementById("search-field")
    const bottom = document.getElementById("bottom")
    const buttons = document.querySelectorAll("button")
    const dropdownContents = document.querySelectorAll(".dropdown-content")

    buttons.forEach(button => {
      const pageNumber = button.id.split('-').filter(part => !isNaN(part))[0];
      if (pageNumber != currentPage)
        button.classList.toggle("dark-button")
    })

    dropdownContents.forEach(dropdownContent => {
      dropdownContent.classList.toggle("dark-dropdown-content")
    })
    const elements = [body, header, crescent_icon, searchFilterSection, country_cards_container, search_section, search_field, bottom]
    const styles = ["dark-body", "dark-header", "dark-crescent-icon", "dark-search-filter-section", "dark-country-cards-container", "dark-search-section", "dark-search-field", "dark-bottom"]

    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.toggle(styles[i])
    }
    if (sun_icon.style.display == "") {
      sun_icon.style.display = "block"
    } else {
      sun_icon.style.display = ""
    }
  }

  document.getElementById("dark-mode").addEventListener("click", function() {
    applyDarkModeState()
    if (darkModeState) {
      darkModeState = false
    } else {
      darkModeState = true
    }
    highlightCurrentPage()
  })
}

// when magnifying icon is clicked, seach field gets focused
function magnifyingIconClickListener() {
  console.log("magnifyingIconClickListener()")
  document.getElementById("magnify-icon").addEventListener("click", function() {
    document.getElementById("search-field").focus()
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

// number of displayed page buttons  based on screen size
function determineNumberOfPageButtons() {
  console.log("determineNumberOfPageButtons() called")
  if (window.innerWidth < 450) {
    NumberOfPageButtons = 3
  } else if (window.innerWidth >= 450 && window.innerWidth < 800) {
    NumberOfPageButtons = 5
  } else if (window.innerWidth >= 800 && window.innerWidth < 1500) {
    NumberOfPageButtons = 7
  } else {
    NumberOfPageButtons = 9
  }
}

// creates all the page number buttons along with <<, prev, next and >>
function createPagesNumbers() {
  console.log("createPageNumbers() called")
  const pages = document.getElementById("pages")
  const numberOfPages = Math.ceil(Object.entries(countries).length/resultsPerPage)
  pages.innerHTML += `
    <button class="page-number" id="<<"><<</button>
    <button class="page-number" id="prev">Prev</button>
  `  
  for (let i = 1; i <=numberOfPages; i++) {
    pages.innerHTML += `
    <button class="page-number" id="page-${i}">${i}</button>
    `
  }
  pages.innerHTML += `
  <button class="page-number" id="next">Next</button>
  <button class="page-number" id=">>">>></button>
  `
  hideExtraPages()
}

// current page button and a certain number of page buttons(based on numberOfPages) gets displayed, others get hidden
function hideExtraPages() {
  console.log("hideExtraPages() called")
  const numberOfPages = Math.ceil(Object.entries(countries).length/resultsPerPage)
  currentPage = +currentPage
  let dispayedPagesNums = [currentPage]
  let interations = Math.floor(NumberOfPageButtons/2)

  let temp = 1
  for (let interation = 1; interation <= interations; interation++) {
    dispayedPagesNums.unshift(currentPage - temp)
    dispayedPagesNums.push(currentPage + temp)
    temp += 1
  }

  let toPush = []
  let toUnshift = []
  let toSplice = []
  for (let i of dispayedPagesNums) {
    if (i < 1) {
      if (toPush.length == 0) {
        toPush.push(dispayedPagesNums[dispayedPagesNums.length - 1] + 1)
      } else {
        toPush.push(toPush[toPush.length - 1] + 1)
      }
      toSplice.push(i)
    } else if (i > numberOfPages) {
      if (toUnshift.length == 0) {
        toUnshift.push(dispayedPagesNums[0] - 1)
      } else {
        toUnshift.push(toUnshift[toUnshift.length - 1] - 1)
      }
      toSplice.push(i)
    }
  }
  for (let i of toSplice) {
    dispayedPagesNums.splice(dispayedPagesNums.indexOf(i), 1)
  }
  for (let i of toPush) {
    dispayedPagesNums.push(i)
  }
  for (let i of toUnshift) {
    dispayedPagesNums.unshift(i)
  }  

  for (let i = 1; i <= numberOfPages; i++) {
    let el = document.getElementById(`page-${i}`)
    if (dispayedPagesNums.includes(i)) {
      if (el.classList.contains("hide")) {
        el.classList.remove("hide")
      }
    } else {
      if (!el.classList.contains("hide")) {
        el.classList.add("hide")
      }
    }
  }
}


// before each call of createPageNumbers(), this function gets called to delete previous pages numbers for new ones
function clearPageNumbers() {
  console.log("clearPagesNumbers() called")
  document.querySelectorAll(".page-number").forEach(el => el.remove())
}

// highlighs current page button, the color depends and status of dark mode
function highlightCurrentPage() {
  console.log("highlightCurrentPage() called")

  const numberOfPages = Math.ceil(Object.entries(countries).length/resultsPerPage)
  for (let i = 1; i <= numberOfPages; i++) {
    let el = document.getElementById(`page-${i}`)
    if (i == +currentPage) {
      if (el.classList.contains("dark-button")) {
        el.classList.remove("dark-button")
      }
      if (!el.classList.contains("highlightCurrentPage")) {
        el.classList.add("highlightCurrentPage")
      }
    } else {
      if (el.classList.contains("highlightCurrentPage")) {
        el.classList.remove("highlightCurrentPage")
      }
      if (darkModeState) {
        if (!el.classList.contains("dark-button")) {
          el.classList.add("dark-button")
        }
      }
    }
  }
}

// detemines number of currentPage based on the click received by page buttons
function selectPage() {
  console.log("selectPage() called")
  const pageNumbers = document.querySelectorAll(".page-number")
  pageNumbers.forEach(page => {
    page.addEventListener("click", function() {
      const nonNumPages = ["&lt;&lt;", "Prev", "Next", "&gt;&gt;"]
      if (!nonNumPages.includes(page.innerHTML)) {
        console.log("Page number selected")
        currentPage = page.innerHTML
      } else {
        if (page.innerHTML == "&lt;&lt;") {
          currentPage = 1
        } else if (page.innerHTML == "Prev") {
          if (currentPage > 1) {
            currentPage -= 1
          }
        } else if (page.innerHTML == "Next") {
          if (currentPage < +Array.from(pageNumbers)[Array.from(pageNumbers).length - 3].innerHTML) {
            currentPage += 1
          } 
        } else if (page.innerHTML == "&gt;&gt;") {
          currentPage = +Array.from(pageNumbers)[Array.from(pageNumbers).length - 3].innerHTML
        }
      }
      managePaginate("select-page")
    })
  })
}

// currentPage resets to 1
function resetCurrentPage() {
  console.log("resetCurrentPage() called")
  currentPage = 1
}

// before each new display of country cards, all the country cards become diplay: none
function resetCountryCardsDisplay() {
  console.log("resetCountryCardDisplay() called")
  document.querySelectorAll(".country-card").forEach(card => {
    card.style.display = "none"
  })
}

// devide country cards into different pages, based on the number of results per page
function paginate() {
  console.log("paginate() called")
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

// displays or hides drop downs, based on user interactions
function showHideDropdowns() {
  console.log("showHideDropdowns() called")  

  const filterByRegionDropdownContentBlock = document.getElementById("filter-by-region-dropdown-content-block")
  const resultsPerPageDropdownBlock = document.getElementById("results-per-page-dropdown-block")

  document.addEventListener("click", function(event) {
    let filterByRegionDropdownContentBlockHeight = getComputedStyle(filterByRegionDropdownContentBlock).height
    if (event.target.closest("#filter-by-region-btn")) {
      if (filterByRegionDropdownContentBlockHeight == "0px") {
        filterByRegionDropdownContentBlock.style.height = filterByRegionDropdownContentBlock.scrollHeight + 'px'
        filterByRegionDropdownContentBlock.style.padding = "0.5rem 0 0.5rem"
      } else {
        filterByRegionDropdownContentBlock.style.height = "0px"
        filterByRegionDropdownContentBlock.style.padding = "0px"        
      }      
    } else {
      if (filterByRegionDropdownContentBlockHeight != "0px") {
        filterByRegionDropdownContentBlock.style.height = "0px"
        filterByRegionDropdownContentBlock.style.padding = "0px"
      }      
    }
    rotateDropdownArrow("filter-by-region")
  })

  document.addEventListener("click", function(event) {
    let resultsPerPageDropdownBlockHeight = getComputedStyle(resultsPerPageDropdownBlock).height
    if (event.target.closest("#results-per-page-btn")) {
      if (resultsPerPageDropdownBlockHeight == "0px") {
        resultsPerPageDropdownBlock.style.height = resultsPerPageDropdownBlock.scrollHeight + 'px'
        resultsPerPageDropdownBlock.style.padding = "0.5rem 0 0.5rem"
      } else {
        resultsPerPageDropdownBlock.style.height = "0px"
        resultsPerPageDropdownBlock.style.padding = "0px"        
      }      
    } else {
      if (resultsPerPageDropdownBlockHeight != "0px") {
        resultsPerPageDropdownBlock.style.height = "0px"
        resultsPerPageDropdownBlock.style.padding = "0px"
      }
    }
    rotateDropdownArrow("results-per-page")
  })
}

// rotates arrows insides dropdown buttons, based on the status of their dropdowns(open or closed)
// setTimeout is written so that the function works properly, without it, it doesn't work well, I don't know why! 
function rotateDropdownArrow(whichArrow="") {
  console.log("rotateDropdownArrow() called")
  setTimeout(() => {
    if (whichArrow == "filter-by-region") {
      const filterByRegionArrow = document.getElementById("filter-by-region-arrow")
      const filterByRegionDropdownContentBlock = document.getElementById("filter-by-region-dropdown-content-block")
      if (!filterByRegionArrow.style.transform) {
        filterByRegionArrow.style.transform = "rotate(0deg)"
      }
      let filterByRegionArrowOrientation = filterByRegionArrow.style.transform
      if (
        (getComputedStyle(filterByRegionDropdownContentBlock).height != "0px" && filterByRegionArrowOrientation == "rotate(0deg)")
      ) {
        filterByRegionArrow.style.transform = "rotate(180deg)"
      } else if (
        ((getComputedStyle(filterByRegionDropdownContentBlock).height == "0px" && filterByRegionArrowOrientation == "rotate(180deg)"))
      ) {
        filterByRegionArrow.style.transform = "rotate(0deg)"
      }
    } else if (whichArrow == "results-per-page") {
      const resultsPerPageArrow = document.getElementById("resultsper-page-arrow")
      const resultsPerPageDropdownBlock = document.getElementById("results-per-page-dropdown-block")
      if (!resultsPerPageArrow.style.transform) {
        resultsPerPageArrow.style.transform = "rotate(0deg)"
      }
      let resultsPerPageArrowOrientation = resultsPerPageArrow.style.transform
      if (
        (getComputedStyle(resultsPerPageDropdownBlock).height != "0px" && resultsPerPageArrowOrientation == "rotate(0deg)")
      ) {
        resultsPerPageArrow.style.transform = "rotate(180deg)"
      } else if (
        ((getComputedStyle(resultsPerPageDropdownBlock).height == "0px" && resultsPerPageArrowOrientation == "rotate(180deg)"))
      ) {
        resultsPerPageArrow.style.transform = "rotate(0deg)"
      }
    }
  }, 300)
}

// is called when a new filter by region value is selected
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

// is called when a new results per page value is selected
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

// its event listener is called when a new input is received by search input
function extractSearch() {
  console.log("extractSearch() called")  
  let searchField = document.getElementById("search-field")
  searchField.addEventListener("input", function() {
    searchedVal = searchField.value.toLowerCase()
    managePaginate("search")
  })
}

// extracts countries based on searched value from countries object
function extractCountriesBySearchedVal() {
  console.log("extractCountriesBySearchedVal() called")  
  resetCountriesObj()
  filteredCountries = {}
  Object.entries(allCountries).forEach(country => {
    if (country[0].toLowerCase().includes(searchedVal)) {
      filteredCountries[country[0]] = country[1]
    }
  })
}

// saves needed info of selected country and navigates page to clicked country page
function goTocountryPage() {
  console.log("goTocountryPage() called")
  document.querySelectorAll(".country-card").forEach(countryCard => {
    countryCard.addEventListener("click", function() {
    let countryName = countryCard.id
    let flagImg = countryCard.querySelector(".flag-img").src 
    let population = countryCard.querySelector(".population").innerHTML
    let region = countryCard.querySelector(".region").innerHTML
    let capital = countryCard.querySelector(".capital").innerHTML
    let nativeName = countryCard.querySelector(".nativeName").innerHTML
    let subregion = countryCard.querySelector(".subregion").innerHTML
    let currencies = countryCard.querySelector(".currencies").innerHTML
    let languages = countryCard.querySelector(".languages").innerHTML
    let borders = countryCard.querySelector(".borders").innerHTML

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
    })
  })
}

// one of manager function that manages to be results based on the state of page or activity of user
// such as: when the page is getting started, when a page number button is clecked,
// when a new filter by region value is selected, when a new results per page value is selected
// when user is searching a countries name or when the screen is resized
function managePaginate(state="") {
  console.log("managePaginate() called")
  if (state == "start") {
    console.log("managePaginate(state=), state = start")
    selectCountriesObj()
    extractResultsPerPage()
    clearPageNumbers()
    determineNumberOfPageButtons()
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
    hideExtraPages()
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
  } else if (state == "resize") {
    console.log("managePaginate(state=), state = resize")
    determineNumberOfPageButtons()
    hideExtraPages();
  }
  highlightCurrentPage()
}

// all the functions get nested inside initializeApp()
function initializeApp() {
  console.log("initializeApp() called")
  extractCountriesInfo()
  createCountryCard()
  managePaginate("start")
  selectPage()
  rotateDropdownArrow()
  showHideDropdowns()
  selectFilterByRegionContent()
  selectResultsPerPageContent()
  extractSearch()
  goTocountryPage()
  darkMode()
  magnifyingIconClickListener()
  window.addEventListener("resize", function() {
    managePaginate("resize")
  })
}

// start app
runFetchData()
