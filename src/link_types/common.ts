import { Link } from "../link/link";
import * as fs from 'fs';

export function save(link: Link): boolean{
    console.log(JSON.stringify(link));
    return false;
}
export function getByUserId(userId: string){
    // TODO: Figure out how the consumer is going to determine what type each link is
    // TODO: Remove this implementation after we know what the data store will be
    // the data store should handle finding the links by userId
    const result = fs.readFileSync(`data/links.json`, { encoding: "utf8" });
    return JSON.parse(result);

}