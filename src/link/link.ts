export interface Link{
    readonly userId: string;
    readonly dateCreated: number;
    readonly url: string;
    readonly type: string;
    readonly title: string;
}
export interface Dependencies{
    validate: (link: Link) => boolean,
    enrich: (link: Link) => Link,
}
export interface ThirdPartyDepdencies{
    save: (link: Link) => boolean,
    getByUserId: (userId: string) => Array<Link>

}
export function createLink(link: Link, deps: Dependencies & ThirdPartyDepdencies): boolean{
    if(deps.validate(link)){
        // This may want to happen when they're retrieved, rather than stored
        link = deps.enrich(link);
        link = {
            ...link,
            dateCreated: Date.now()
        }
        deps.save(link);
        return true;
    }

    return false;
}

export function getByUserId(userId: string, deps: ThirdPartyDepdencies, shouldSort = false): Link[]{
    let sortedLinks: Link[] = deps.getByUserId(userId);

    if(shouldSort){
        sortedLinks = sortedLinks.sort((a,b) => a.dateCreated - b.dateCreated);
    }
    return sortedLinks;
}