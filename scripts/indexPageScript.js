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

function extractCountriesInfo() {
  console.log("extractCountriesInfo() called")
  let deconstructedCapital;
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

    let borders;
    if (country.borders == undefined) {
      borders = "None"
    } else {
      borders = country.borders
    }
    // some seem extras
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

///////////////////////////////////////////////
function darkMode() {
  document.getElementById("dark-mode").addEventListener("click", function() {
    const body = document.querySelector("body")
    const header = document.querySelector("header")
    const searchFilterSection = document.getElementById("search-filter-section")

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

////////////////////////////////////
function hideExtraPages() {
  console.log("hideExtraPages() called")
  const pages = document.querySelectorAll(".page-number")
  const numberOfPages = Math.ceil(Object.entries(countries).length/resultsPerPage)
  let howManyNumbersToGetDisplayed = 3
  currentPage = 21
  // currentPage = +currentPage
  let dispayedPagesNums = [currentPage]
  // const pagesNums = [...Array(numberOfPages+1).keys()].slice(1)
  
  pages.forEach(page => {
    if (page.id != "prev" && page.id != "next" && page.id != "<<" && page.id != ">>") {
      page.style.display = "none"
    }
  })

  let interations = 4
  let temp = 1
  for (let interation = 1; interation <= interations; interation++) {
    dispayedPagesNums.unshift(currentPage - temp)
    dispayedPagesNums.push(currentPage + temp)
    // if (currentPage - temp > 0) {
    //   dispayedPagesNums.unshift(currentPage - temp)
    // } else {
    //   dispayedPagesNums.push(currentPage + temp)
    // }
    // if (currentPage + temp <= numberOfPages) {
    //   dispayedPagesNums.push(currentPage + temp)
    // } else {
    //   dispayedPagesNums.unshift(currentPage - temp)
    // }
    temp += 1
    // dispayedPagesNums.splice()
  }
  ///////////////////////////////
  let idx = 0
  let count = 0
  while (true) {
    if (dispayedPagesNums[idx] < 1) {
      dispayedPagesNums.push(dispayedPagesNums[dispayedPagesNums.length - 1] + 1)
      dispayedPagesNums.splice(idx, 1)
      idx = 0
    } else if (dispayedPagesNums[idx] > numberOfPages) {
      dispayedPagesNums.unshift(dispayedPagesNums[0] - 1)
      dispayedPagesNums.splice(i+1, 1)
      idx = 0
    }
    let breakLoop = true
    for (let i of dispayedPagesNums) {
      if (i < 1 || i > numberOfPages) {
        breakLoop = false
      }
    }
    if (breakLoop) {
      console.log(dispayedPagesNums, 333333333333333333333333)
      return
    }
    if (count >= 120) {
      console.log("yyyyyyyyyyyyyyy")
      return
    }
  }
  // for (let i = 0; i <= dispayedPagesNums.length - 1; i++) {
  //   if (dispayedPagesNums[i] < 1) {
  //     dispayedPagesNums.push(dispayedPagesNums[dispayedPagesNums.length - 1] + 1)
  //     dispayedPagesNums.splice(i, 1)
  //   } else if (dispayedPagesNums[i] > numberOfPages) {
  //     dispayedPagesNums.unshift(dispayedPagesNums[0] - 1)
  //     dispayedPagesNums.splice(i+1, 1)
  //   }
  // }
  console.log(dispayedPagesNums, 11111111111)
  // for (let i of dispayedPagesNums) {
  //   if (i < 1) {
  //     dispayedPagesNums.push(dispayedPagesNums[dispayedPagesNums.length - 1] + 1)
  //   } else if (i > numberOfPages) {
  //     dispayedPagesNums.unshift(dispayedPagesNums[0] - 1)
  //   }
  //   console.log(dispayedPagesNums)
  // }
  // let temp = 1
  // while (1 == 1) {
  //   if (currentPage - temp > 0) {
  //     dispayedPagesNums.unshift(currentPage - temp)
  //   } else {
  //     dispayedPagesNums.push(currentPage + temp)
  //   }
  //   if (currentPage + temp <= numberOfPages) {
  //     dispayedPagesNums.push(currentPage + temp)
  //   } else {
  //     dispayedPagesNums.unshift(currentPage - temp)
  //   }
  //   temp += 1
  //   console.log(dispayedPagesNums)
  //   if (dispayedPagesNums.length >= howManyNumbersToGetDisplayed) {
  //     return
  //   }
  // }
  // while (dispayedPagesNums.length != howManyNumbersToGetDisplayed) {
  //   if (currentPage - 1 > 0) {
  //     dispayedPagesNums.unshift(currentPage - 1)
  //     if (currentPage + 1 <= numberOfPages) {
  //       dispayedPagesNums.push(currentPage + 1)
  //     }
  //   }
  //   console.log(dispayedPagesNums)
  // }

  // if (numberOfPages > 8) {
  //   if ([1, 2, 3].includes(currentPage)) {
  //     // 1,2,3
  //     // 1,2,3,4,5...20
  //     for (let id of [1, 2, 3]) {
  //       document.getElementById(`page-${id}`).style.display = ""
  //     }
  //     document.getElementById(`three-dots-right`).style.display = ""
  //     document.getElementById(`page-${numberOfPages}`).style.display = ""
  //   } else if (currentPage == 4) {
  //       // 4
  //       // 1,2,3,4,5,6...20
  //       for (let id of [1, 2, 3, 4, 5, 6]) {
  //         document.getElementById(`page-${id}`).style.display = ""
  //       } 
  //       document.getElementById(`three-dots-right`).style.display = ""
  //       document.getElementById(`page-${numberOfPages}`).style.display = ""
  //     }
  //   else if (currentPage == 5) {
  //     // 5
  //     // 1,2,3,4,5,6,7...20
  //     for (let id of [1, 2, 3, 4, 5, 6, 7]) {
  //       document.getElementById(`page-${id}`).style.display = ""
  //     }
  //     document.getElementById(`three-dots-right`).style.display = ""
  //     document.getElementById(`page-${numberOfPages}`).style.display = ""
  //   } else if (currentPage == pagesNums.length - 3) {
  //     // 17
  //     // 1...15,16,17,18,19,20
  //     document.getElementById(`page-1`).style.display = ""
  //     for (let id = pagesNums.length - 6; id <= pagesNums.length; id++) {
  //       document.getElementById(`page-${id}`).style.display = ""        
  //     }
  //     document.getElementById(`three-dots-left`).style.display = ""
  //   } else if (pagesNums.slice(pagesNums.length - 3).includes(+currentPage)) {
  //     // 18,19,20
  //     // 1...16,17,18,19,20
  //     document.getElementById(`page-1`).style.display = ""
  //     for (let id of pagesNums.slice(pagesNums.length - 5)) {
  //       document.getElementById(`page-${id}`).style.display = ""
  //     }
  //     document.getElementById(`three-dots-left`).style.display = ""
  //   } else {
  //     document.getElementById(`three-dots-left`).style.display = ""
  //     document.getElementById(`three-dots-right`).style.display = ""
  //     document.getElementById(`page-1`).style.display = ""
  //     document.getElementById(`page-${numberOfPages}`).style.display = ""
  //     for (let id = +currentPage - 2; id <= +currentPage + 2; id++) {
  //       // 1...n,n,n,n,n...20
  //       document.getElementById(`page-${id}`).style.display = ""
  //     }
  //   }
  // }
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
      const nonNumPages = ["...", "&lt;&lt; Prev", "Next &gt;&gt;"]
      if (!nonNumPages.includes(page.innerHTML)) {
        console.log("Page number selected")
        currentPage = page.innerHTML
        managePaginate("select-page")
      } else if (page.innerHTML == "&lt;&lt; Prev") {
        try {
          currentPage = currentPage - 1
          managePaginate("select-page")
        } catch(error) {
          console.log(error)
        }
      }
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

  const filterByRegionDropdownContentBlock = document.getElementById("filter-by-region-dropdown-content-block")
  const resultsPerPageDropdownBlock = document.getElementById("results-per-page-dropdown-block")

  function showHideFilterByRegionDropdownContentBlock(onlyHide=false) {
    if (onlyHide) {
      if (getComputedStyle(filterByRegionDropdownContentBlock).height != "0px") {
        filterByRegionDropdownContentBlock.style.height = "0px"
        filterByRegionDropdownContentBlock.style.padding = "0px"              
      }
    } else {
      if (getComputedStyle(filterByRegionDropdownContentBlock).height == "0px") {
        filterByRegionDropdownContentBlock.style.height = filterByRegionDropdownContentBlock.scrollHeight + 'px'
        filterByRegionDropdownContentBlock.style.padding = "0.5rem 0 0.5rem"
      } else {
        filterByRegionDropdownContentBlock.style.height = "0px"
        filterByRegionDropdownContentBlock.style.padding = "0px"        
      }
    }
  }

  function showHideResultsPerPageDropdownBlock(onlyHide=false) {
    if (onlyHide) {
      if (getComputedStyle(resultsPerPageDropdownBlock).height != "0px") {
        resultsPerPageDropdownBlock.style.height = "0px"
        resultsPerPageDropdownBlock.style.padding = "0px"        
      }
    } else {
      if (getComputedStyle(resultsPerPageDropdownBlock).height == "0px") {
        resultsPerPageDropdownBlock.style.height = resultsPerPageDropdownBlock.scrollHeight + 'px'
        resultsPerPageDropdownBlock.style.padding = "0.5rem 0 0.5rem"
      } else {
        resultsPerPageDropdownBlock.style.height = "0px"
        resultsPerPageDropdownBlock.style.padding = "0px"
      }
    }
  }

  document.addEventListener("click", function(event) {
    if (event.target.closest("#filter-by-region-btn")) {
      showHideFilterByRegionDropdownContentBlock()
    } else {
      showHideFilterByRegionDropdownContentBlock(true)
    }
  })

  // results-per-page-btn
  document.addEventListener("click", function(event) {
    if (event.target.closest("#results-per-page-btn")) {
      showHideResultsPerPageDropdownBlock()      
    } else {
      showHideResultsPerPageDropdownBlock(true)
    }
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

function goTocountryPage() {
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
    window.location.href = "country-page.html"
    })
  })
}


// "Population": country.population, // some are 0
// "Region": country.region,
// "Capital": country.capital, // some have more than one
// "flag": country.flags.png,
// "native-name": nativeName,
// "subregion": subRegion,
// "currencies": currencies,
// "languages": languages,


// const queryString = `?theme=${encodeURIComponent(theme)}&numberOfPlayers=${encodeURIComponent(numberOfPlayers)}&gridSize=${encodeURIComponent(gridSize)}`
// window.location.href = "gamepage.html" + queryString  //  parameters get passed with url to the next page
// gets settings parameters sent by index.html




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
  goTocountryPage()
  darkMode()
}

// start app
runFetchData()
