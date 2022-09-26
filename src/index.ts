import fetch from 'cross-fetch'
import taxRates from './data/taxRate.json'

/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they are all fetched at once then when they are done, return all
 * the titles and make this function faster?
 *
 * @returns array of strings
 */
export async function returnSiteTitles() {
  const urls = [
    'https://patientstudio.com/',
    'https://www.startrek.com/',
    'https://www.starwars.com/',
    'https://www.neowin.net/'
  ]

  // generate promises according to each site request for getting titles
  const requestPromises = urls.map(async (url: string) => {
    try {
      const response = await fetch(url)
      // when response is not successful, return empty string
      if (response.status !== 200) return ''

      const data = await response.text()
      const match = data.match(/<title>(.*?)<\/title>/)

      if (match?.length) return match[1]
      else return ''
    } catch (error) {
      return ''
    }
  })

  // execute all requests for getting the titles
  const titles: Array<string> = await Promise.all(requestPromises)

  return titles
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops; can you refactor this to have the least amount of loops possible.
 * The test is also failing for some reason.
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function findTagCounts(localData: Array<SampleDateRecord>): Array<TagCounts> {
  const tagCounts: Array<TagCounts> = []

  localData.forEach(data => {
    const tags = data.tags ?? [] // data.tags ? data.tags : []
    tags.forEach(tag => {
      // find the index of existing tag on tagCounts variable
      const index = tagCounts.findIndex(tagCount => tagCount.tag === tag)
      if (index != -1) {
        // in finding
        tagCounts[index].count++
      } else {
        // in not finding
        tagCounts.push({ tag: tag, count: 1 })
      }
    })
  })

  return tagCounts
}

/**
 * Calcualte total price
 *
 * Task: Write a function that reads in data from `importedItems` array (which is imported above) and calculates the total price, including taxes based on each
 * countries tax rate.
 *
 * Here are some useful formulas and infomration:
 *  - import cost = unit price * quantity * importTaxRate
 *  - total cost = import cost + (unit price * quantity)
 *  - the "importTaxRate" is based on they destiantion country
 *  - if the imported item is on the "category exceptions" list, then no tax rate applies
 */
export function calcualteImportCost(importedItems: Array<ImportedItem>): Array<ImportCostOutput> {
  // function that gets taxRate by country destination and category
  const getTaxRatebyCountryAndCategory = (countryDestination: string, category: string) => {
    const taxRate = taxRates.find(tr => tr.country === countryDestination)
    // if the imported item is on the "category exceptions" list, then no tax rate applies
    return taxRate ? (taxRate.categoryExceptions.find(ce => ce === category) ? 0 : taxRate.importTaxRate) : 0
  }

  const totalCostResult = importedItems.map(
    ({ name, unitPrice, quantity, countryDestination, category }): ImportCostOutput => {
      // calculate some values by some useful formulas and infomration
      const subTotal = unitPrice * quantity
      const importCost = subTotal * getTaxRatebyCountryAndCategory(countryDestination, category)
      const totalCost = subTotal + importCost
      return { name: name, subtotal: subTotal, importCost: importCost, totalCost: totalCost }
    }
  )

  return totalCostResult
}
