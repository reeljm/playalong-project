import { Note } from "../../theory/note";
import { Chord } from "../../theory/chord";

export class BasslineRequestParams {
    requireChordTone: boolean = true;
    chord: Chord;
    desiredDirection: string;
    highestNote: Note;
    lowestNote: Note;
    lastNoteScheduled?: Note;
    desiredDegreeOfChord?: number;
    desiredOctave?: number;
}
