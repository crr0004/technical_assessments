import {createLink, getByUserId, Link, Dependencies, ThirdPartyDepdencies} from "./link"
describe("Link Service", () => {
    const link: Link = {
        userId: "hello",
        dateCreated: new Date()
    };

    const deps: Dependencies & ThirdPartyDepdencies = {
        enrich: jest.fn().mockReturnValue(link),
        getByUserId: jest.fn().mockReturnValue([link]),
        save: jest.fn().mockReturnValue(true),
        validate: jest.fn().mockReturnValue(true)
    };
    it("Can create and restore a link", () => {
        
        expect(createLink(link, deps)).toBe(true);
    });
    it("Can find links by userId", () => {

        createLink(link, deps);
        const userLinks = getByUserId(link.userId, deps);
        expect(userLinks[0].userId).toStrictEqual(link.userId);
    })

});
