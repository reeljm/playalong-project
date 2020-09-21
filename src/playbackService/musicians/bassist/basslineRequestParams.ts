import { Note } from "../../theory/note";
import { Chord } from "../../theory/chord";

export class BasslineRequestParams {
    requireRoot: boolean = true;
    currentChord: Chord;
    desiredDirection: string;
    highestNote: Note;
    lowestNote: Note;
    previousNoteScheduled?: Note;
    desiredDegreeOfChord?: number;
    desiredOctave?: number;
    nextChord: Chord;
    previousChord?: Chord;
    isLastBeatOfCurrentChord: boolean;
    beatsAlreadySpentOnCurrentChord: number;
    nextBeatIsStrongBeat: boolean;
}
