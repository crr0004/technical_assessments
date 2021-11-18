import { Link } from "../link/link";
import { ShowsLink } from "./types";

export function validate(link: Link): boolean {
    //TODO: This should throw an error rather an returning boolean
    return (link as ShowsLink).showId !== undefined && (link as ShowsLink).showId.length > 0
}
export function enrich(link: Link): Link{
    // TODO: Call a third party to find out what shows are avaliable
    return link
}