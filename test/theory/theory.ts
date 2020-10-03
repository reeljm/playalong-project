import * as assert from "assert";
import { Theory } from "../../src/playbackService/theory/theory";
import { Note } from "../../src/playbackService/theory/note";

describe('Theory', function () {
    
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


    describe('#parseEnharmonicPitch()', function () {

        const testEnharmonic = (input: string, expected: string) => {
            it(`${input} => ${expected}`, () => {
                const t: Theory = new Theory();
                const result: string = t.parseEnharmonicPitch(input);
                assert.equal(result, expected);
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

        describe("Pitches with invalid characters should return null", () => {
            testEnharmonic("S#b#b#b#bbbb", null);
            testEnharmonic("############b", null);
            testEnharmonic("FF", null);
            testEnharmonic("bEb", null);
        });
    });
});
