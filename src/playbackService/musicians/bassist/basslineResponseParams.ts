import { Note } from "../../theory/note";

export class BasslineResponseParams {
    notesScheduled: Note[];
    directionChange: boolean;

    public static createBasslineResponseParams(): BasslineResponseParams {
        return new BasslineResponseParams();
    }
}
