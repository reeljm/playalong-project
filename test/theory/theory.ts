import * as assert from "assert";
import { Note } from "../../src/playbackService/theory/note";
import { Theory } from "../../src/playbackService/theory/theory";

describe('Theory', function () {
    describe('#parseEnharmonicPitch()', function () {

        const testEnharmonic = (input: string, expected: string) => {
            it(`${input} => ${expected}`, () => {
                const t: Theory = new Theory();
                const result: string = t.parseEnharmonicPitch(input);
                assert.equal(result, expected)
            });
        };
        describe("natural notes", () => {
            const naturals: string[] = ["C", "D", "E", "F", "G", "A", "B"];
            for (const n of naturals) {
                testEnharmonic(n, n);
            }
        });

        describe("simplified sharps", () => {
            const naturals: string[] = ["C#", "D#", "F#", "G#", "A#"];
            for (const n of naturals) {
                testEnharmonic(n, n);
            }
        });

        describe("flats", () => {
            testEnharmonic("Bb", "A#");
            testEnharmonic("Ab", "G#");
            testEnharmonic("Eb", "D#");
            testEnharmonic("Db", "C#");
            testEnharmonic("Gb", "F#");
        });

        describe("mix of sharps and flats", () => {
            testEnharmonic("C#b#b#b#bbbb", "A");
            testEnharmonic("C############b", "B");
            testEnharmonic("Eb#", "E");
            testEnharmonic("Db#b", "C#");
        });
    });
});
