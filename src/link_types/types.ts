import { Link } from "../link/link";

export enum LinkTypes {
    CLASSIC = "classic",
    MUSIC = "music",
    SHOWS = "shows"
}

export interface ClassicLink extends Link {
    readonly title: string;

}

export interface MusicLink extends Link {
    readonly songId: string;

}

export interface ShowsLink extends Link {
    readonly showId: string;

}
