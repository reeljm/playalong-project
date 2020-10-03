var assert = require('assert');
import { Note } from "../../src/playbackService/theory/note";

describe('Note', function () {
    describe('#getNote()', function () {
        it('should return a note when a valid pitch and octave are supplied', () => {
            const n: Note = Note.getNote("C", 5);
            assert.equal(n.pitch, "C");
            assert.equal(n.octave, 5);
        });

        it('should return a note when the lowest valid pitch and octave are supplied', () => {
            const n: Note = Note.getNote("C", 1);
            assert.equal(n.pitch, "C");
            assert.equal(n.octave, 1);
        });

        it('should return the lowest valid octave of given note when octave supplied is too low', () => {
            const n: Note = Note.getNote("B", 0);
            assert.equal(n.pitch, "B");
            assert.equal(n.octave, 1);
        });

        it('should return the highest valid octave of given note when octave supplied is too high', () => {
            const n: Note = Note.getNote("B", 11);
            assert.equal(n.pitch, "B");
            assert.equal(n.octave, 10);
        });

        it('should return the highest valid octave of given note when octave supplied is too high', () => {
            const n: Note = Note.getNote("B", 11);
            assert.equal(n.pitch, "B");
            assert.equal(n.octave, 10);
        });

        it('should return null when the pitch supplied is not one of the 12 pitches', () => {
            const n: Note = Note.getNote("F sharp", 1);
            assert.equal(n, null);
        });
    });
});
