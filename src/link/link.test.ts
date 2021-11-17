import {createLink, getByUserId, Link} from "./link"
describe("Link Service", () => {
    it("Can create and restore a link", () => {
        const link: Link = {
            userId: "hello",
            dateCreated: new Date()
        };
        expect(createLink(link)).toBe(true);
    });
    it("Can find links by userId", () => {
        const link: Link = {
            userId: "hello",
            dateCreated: new Date()
        };

        createLink(link);
        const userLinks = getByUserId(link.userId);
        expect(userLinks[0].userId).toStrictEqual(link.userId);
    })

});
