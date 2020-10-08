import { Chord } from "../../theory/chord";
import { Note } from "../../theory/note";

export class BasslineCurrentState {
    public previousNoteScheduled: Note = null;
    public previousChord: Chord = null;
    public currentOctave: number;
    public direction: string;
    public beatsAlreadySpentOnCurrentChord: number = 0;
}
