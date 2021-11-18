import { getByUserId } from './common'
import { LinkTypes } from './types';
describe("Common functions", () => {
    it("Can read files for users", () => {
        const links = getByUserId("");
        expect(links[0].userId).toContain("yourname");
        expect(links[0].url).toContain("classic");
    })

});