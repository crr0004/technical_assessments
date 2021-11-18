import { Link } from '../link/link'
import {MAX_TITLE_LENGTH, validate} from './classic_link'
import { ClassicLink, LinkTypes } from './types'
describe("Classic links", () => {
    it("Validate the title", () => {
        let link = {
            dateCreated: Date.now(),
            type: LinkTypes.CLASSIC,
            url: "http://hello.example.com",
            userId: "yourname",
            title: "hello"
        } as ClassicLink
        expect(validate(link)).toBe(true);

        const badLink = {
            ...link,
            title: "a".repeat(MAX_TITLE_LENGTH+1)
        }
        expect(validate(badLink)).toBe(false);
        
    })
})