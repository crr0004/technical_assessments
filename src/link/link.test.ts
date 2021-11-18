import { createLink, getByUserId, Link, Dependencies, ThirdPartyDepdencies } from "./link"
import * as common from '../link_types/common'
describe("Link Service", () => {
    const link: Link = {
        userId: "hello",
        dateCreated: Date.now(),
        url: "http://none",
        type: "none",
        title: "none"
    };

    const deps: Dependencies & ThirdPartyDepdencies = {
        enrich: jest.fn().mockReturnValue(link),
        getByUserId: jest.fn().mockReturnValue([link]),
        save: jest.fn().mockReturnValue(true),
        validate: jest.fn().mockReturnValue(true)
    };
    it("Can create and restore a link", () => {
        
        expect(createLink(link, deps)).toBe(true);

        (deps.validate as jest.Mock).mockReturnValue(false);
        expect(createLink(link, deps)).toBe(false);
    });
    it("Can find links by userId", () => {

        const userLinks = getByUserId(link.userId, deps);
        expect(userLinks[0].userId).toStrictEqual(link.userId);
    })
    it("Can get links by userId sorted by time", () => {
        deps.getByUserId = common.getByUserId;
        const links = getByUserId(link.userId, deps, true)
        expect(links[0].title).toStrictEqual("Shows");
        expect(links[0].dateCreated < links[1].dateCreated).toBe(true);
    })

});
