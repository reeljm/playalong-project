import * as assert from "assert";
import { Theory } from "../../src/playbackService/theory/theory";
import { Note } from "../../src/playbackService/theory/note";

describe('Theory', function () {
    
    describe("#transpose(note, steps)", function() {
        const t: Theory = new Theory();
        const testTranspose = (startPitch: string, startOctave: number, steps: number, endPitch: string, endOctave: number) => {
            const n1: Note = t.getNote(startPitch, startOctave);
            const n2: Note = t.getNote(endPitch, endOctave);
            const actual = t.transpose(n1, steps);
            assert.equal(n2.pitch, actual.pitch);
            assert.equal(n2.octave, actual.octave);
        }; 
        it("should transpose the given note up if steps is positive", () => {
            testTranspose("C", 5, 4, "E", 5);
        });
        
        it("should transpose the given note down if steps is negative", () => {
            testTranspose("C", 5, -4, "G#", 4);
        });

        it("should transpose the given note up into a higher octave if steps > 12", () => {
            testTranspose("C", 5, 12, "C", 6);
        });

        it("should transpose the given note down into a lower octave if steps < -12", () => {
            testTranspose("C", 5, -12, "C", 4);
        });

        it("should return the given note if steps = 0", () => {
            testTranspose("C", 5, 0, "C", 5);
        });
    });

    describe('#distanceTo(note1, note2)', function () {
        const t: Theory = new Theory();
        const testDistance = (note1: Note, note2: Note, expected: number) => {
            it(`${note1.toPlayableString()} to ${note2.toPlayableString()} => ${expected}`, () => {
                const result: number = t.distanceTo(note1, note2)
                assert.equal(result, expected);
            });
        };

        describe("distances from low to high are represented as positive numbers", () => {
            let note1 = t.getNote("C", 5);
            let note2 = t.getNote("G", 5);
            testDistance(note1, note2, 7);

            note1 = t.getNote("C", 5);
            note2 = t.getNote("C", 6);
            testDistance(note1, note2, 12);

            note1 = t.getNote("C", 5);
            note2 = t.getNote("C#", 5);
            testDistance(note1, note2, 1);
        });

        describe("distances from high to low are represented as negative numbers", () => {
            let note1 = t.getNote("G", 5);
            let note2 = t.getNote("C", 5);
            testDistance(note1, note2, -7);

            note1 = t.getNote("C", 6);
            note2 = t.getNote("C", 5);
            testDistance(note1, note2, -12);

            note1 = t.getNote("C#", 5);
            note2 = t.getNote("C", 5);
            testDistance(note1, note2, -1);
        });

        describe("distance between a note and itself is 0", () => {
            let note1 = t.getNote("C", 5);
            let note2 = t.getNote("C", 5);
            testDistance(note1, note2, 0);
        });
    });

    describe('#parseEnharmonicPitch(pitch)', function () {
        const testEnharmonic = (input: string, expected: string) => {
            it(`${input} => ${expected}`, () => {
                const t: Theory = new Theory();
                const result: string = t.parseEnharmonicPitch(input);
                assert.equal(result, expected);
            });
        };

        const testInvalidEnharmonic = (input: string) => {
            it(`${input} => throw invaid pitch error`, () => {
                const t: Theory = new Theory();
                assert.throws(()=>t.parseEnharmonicPitch(input), Error);
            });
        };
        describe("Natural notes", () => {
            const naturals: string[] = ["C", "D", "E", "F", "G", "A", "B"];
            for (const n of naturals) {
                testEnharmonic(n, n);
            }
        });

        describe("Simplified sharps", () => {
            const naturals: string[] = ["C#", "D#", "F#", "G#", "A#"];
            for (const n of naturals) {
                testEnharmonic(n, n);
            }
        });

        describe("Flats", () => {
            testEnharmonic("Bb", "A#");
            testEnharmonic("Ab", "G#");
            testEnharmonic("Eb", "D#");
            testEnharmonic("Db", "C#");
            testEnharmonic("Gb", "F#");
        });

        describe("Mix of sharps and flats", () => {
            testEnharmonic("C#b#b#b#bbbb", "A");
            testEnharmonic("C############b", "B");
            testEnharmonic("Eb#", "E");
            testEnharmonic("Db#b", "C#");
        });

        describe("Pitches with invalid characters should throw InvalidPitchError", () => {
            testInvalidEnharmonic("S#b#b#b#bbbb");
            testInvalidEnharmonic("############b");
            testInvalidEnharmonic("FF");
            testInvalidEnharmonic("bEb");
        });
    });
});
