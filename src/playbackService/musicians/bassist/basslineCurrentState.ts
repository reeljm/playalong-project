import { Chord } from "../../theory/chord";
import { Note } from "../../theory/note";
import { BasslineRequestParams } from "./basslineRequestParams";

export class BasslineCurrentState {
    public previousNoteScheduled: Note = null;
    public previousChord: Chord = null;
    public currentOctave: number;
    public direction: BasslineRequestParams.Dir;
    public beatsAlreadySpentOnCurrentChord: number = 0;
}
