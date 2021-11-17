import { Dependencies, Link } from "../link/link";
import * as classic from "./classic_link"
import * as common from "./common";
import { LinkTypes } from "./types";


const classicDeps: Dependencies = {
    validate: classic.validate,
    enrich: classic.enrich ,
    save: common.save,
    getByUserId: common.getByUserId
}

export const DependenciesMap: Map<LinkTypes, Dependencies> = new Map([
    [LinkTypes.CLASSIC, classicDeps],
    [LinkTypes.MUSIC, classicDeps], 
    [LinkTypes.SHOWS, classicDeps]

])