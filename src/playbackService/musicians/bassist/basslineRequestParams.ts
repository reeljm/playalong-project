import { Note } from "../../theory/note";
import { Chord } from "../../theory/chord";

export class BasslineRequestParams {
    requireRoot: boolean = true;
    currentChord: Chord;
    desiredDirection:BasslineRequestParams.Dir;
    highestNote: Note;
    lowestNote: Note;
    previousNoteScheduled?: Note;
    desiredScaleDegree?: number;
    desiredOctave?: number;
    nextChord: Chord;
    previousChord?: Chord;
    isLastBeatOfCurrentChord: boolean;
    beatsAlreadySpentOnCurrentChord: number;
    nextBeatIsStrongBeat: boolean;
    rest: boolean;
}

export namespace BasslineRequestParams
{
    export enum Dir
    {
        Up = "up",
        Down = "down",
    }
}
