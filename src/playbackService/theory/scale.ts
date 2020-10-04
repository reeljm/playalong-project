import rawData from '../staticFiles/scales.json';
import { InvalidScaleError } from './invalidScaleError';

const scaleNamesToPitches = (rawData as any);

export class Scale {

    pitches: string[];
    root: string;
    type: string;

    // no octave information is used in this class. that information is handled
    // by the theory service.

    private constructor(pitches: string[], root: string, type: string) {
        this.pitches = pitches;
        this.root = root;
        this.type = type;
    }

    public static getScale(root: string, scaleType: string): Scale {
        const scaleName = `${root}_${scaleType}`;
        const pitches: string[] = scaleNamesToPitches[scaleName];
        if (!pitches) {
            throw new InvalidScaleError(scaleName);
        }
        return new Scale(pitches, root, scaleType);
    }
}
