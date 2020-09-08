import rawData from '../staticFiles/scales.json';

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

    public getNotesByScaleDegree(...scaleDegrees: number[]): string[] {
        return [];
    }

    public contains(note: string): boolean {
        return false;
    }

    public getScaleDegreeOfNote(note: string): number {
        return -1;
    }

    public static getScale(root: string, scaleType: string): Scale {
        const pitches: string[] = scaleNamesToPitches[`${root}_${scaleType}`];
        return new Scale(pitches, root, scaleType);
    }
}
