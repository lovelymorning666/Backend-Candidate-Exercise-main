import fetch from 'cross-fetch';
import taxRates from './data/taxRate.json';
export async function returnSiteTitles() {
    const urls = [
        'https://patientstudio.com/',
        'https://www.startrek.com/',
        'https://www.starwars.com/',
        'https://www.neowin.net/'
    ];
    const requestPromises = urls.map(async (url) => {
        try {
            const response = await fetch(url);
            if (response.status !== 200)
                return '';
            const data = await response.text();
            const match = data.match(/<title>(.*?)<\/title>/);
            if (match === null || match === void 0 ? void 0 : match.length)
                return match[1];
            else
                return '';
        }
        catch (error) {
            return '';
        }
    });
    const titles = await Promise.all(requestPromises);
    return titles;
}
export function findTagCounts(localData) {
    const tagCounts = [];
    localData.forEach(data => {
        var _a;
        const tags = (_a = data.tags) !== null && _a !== void 0 ? _a : [];
        tags.forEach(tag => {
            const index = tagCounts.findIndex(tagCount => tagCount.tag === tag);
            if (index != -1) {
                tagCounts[index].count++;
            }
            else {
                tagCounts.push({ tag: tag, count: 1 });
            }
        });
    });
    return tagCounts;
}
export function calcualteImportCost(importedItems) {
    const getTaxRatebyCountryAndCategory = (countryDestination, category) => {
        const taxRate = taxRates.find(tr => tr.country === countryDestination);
        return taxRate ? (taxRate.categoryExceptions.find(ce => ce === category) ? 0 : taxRate.importTaxRate) : 0;
    };
    const totalCostResult = importedItems.map(({ name, unitPrice, quantity, countryDestination, category }) => {
        const subTotal = unitPrice * quantity;
        const importCost = subTotal * getTaxRatebyCountryAndCategory(countryDestination, category);
        const totalCost = subTotal + importCost;
        return { name: name, subtotal: subTotal, importCost: importCost, totalCost: totalCost };
    });
    return totalCostResult;
}
