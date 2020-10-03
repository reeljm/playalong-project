import * as assert from "assert";
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
