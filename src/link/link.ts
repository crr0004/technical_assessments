export interface Link{
    readonly userId: string;
    readonly dateCreated: Date;
}
export function createLink(link: Link): boolean{

    return false;
}

export function getByUserId(userId: String): Array<Link>{

    return [{userId: "", dateCreated: new Date()}];
}