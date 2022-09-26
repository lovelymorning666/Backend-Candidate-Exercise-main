import * as testFunctions from './index';
import localData from './data/records.json';
describe('Test findTagCounts', () => {
    it('should count the correct number of tag occurrences', () => {
        const tagCounts = testFunctions.findTagCounts(localData);
        expect(tagCounts).toHaveLength(62);
        const test1 = tagCounts.find(tagCount => tagCount.tag === 'occaecat');
        const test2 = tagCounts.find(tagCount => tagCount.tag === 'cupidatat');
        const test3 = tagCounts.find(tagCount => tagCount.tag === 'velit');
        expect(test1.count).toBe(6);
        expect(test2.count).toBe(5);
        expect(test3.count).toBe(1);
    });
});
