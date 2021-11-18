import { Link } from "../link/link";

export const MAX_TITLE_LENGTH = 144;
export function validate(link: Link): boolean{
    let valid = false;
    if(link.title && link.title.length <= MAX_TITLE_LENGTH){
        valid = true;
    }
    //TODO: This should throw an error rather an returning boolean
    
    return valid;

}
export function enrich(link: Link): Link{
    return link
}