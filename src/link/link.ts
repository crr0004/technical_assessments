export interface Link{
    readonly userId: string;
    readonly dateCreated: Date;
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
        link = deps.enrich(link);
        deps.save(link);
        return true;
    }

    return false;
}

export function getByUserId(userId: string, deps: ThirdPartyDepdencies): Array<Link>{

    return deps.getByUserId(userId);
}