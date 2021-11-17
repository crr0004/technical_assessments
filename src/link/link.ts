export interface Link{
    readonly userId: string;
    readonly dateCreated: Date;
}
export interface Dependencies{
    validate: (link: Link) => boolean,
    enrich: (link: Link) => Link,
    save: (link: Link) => boolean,
    getByUserId: (userId: string) => Array<Link>
}
export function createLink(link: Link, deps: Dependencies): boolean{

    return false;
}

export function getByUserId(userId: string, deps: Dependencies): Array<Link>{

    return [{userId: "", dateCreated: new Date()}];
}