import { Dependencies, Link } from "../link/link";
import * as classic from "./classic_link"
import * as show from "./show_link"
import * as music from "./music_link"
import { LinkTypes } from "./types";


const classicDeps: Dependencies = {
    validate: classic.validate,
    enrich: classic.enrich,
}
const musicDeps: Dependencies = {
    validate: classic.validate,
    enrich: music.enrich,
}
const showsDeps: Dependencies = {
    validate: show.validate,
    enrich: show.enrich,
}

export const DependenciesMap: Map<LinkTypes, Dependencies> = new Map([
    [LinkTypes.CLASSIC, classicDeps],
    [LinkTypes.MUSIC, musicDeps], 
    [LinkTypes.SHOWS, showsDeps]

])