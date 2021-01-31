import { Panner, Sampler } from 'tone';
import { Instrument } from '../instrument';
import rawData from '../../staticFiles/samples/drums/config.json';
const fileConfig: {noteName: string} = (rawData as any);

export enum KitPiece {
    RideCym = 'ride-cym',
    HatChick = 'hat-chick',
    CrossStick = 'cross-stick',
    Bell = 'bell',
    Snare = 'snare',
    Kick = 'kick',
    HighTom = 'highTom'
}

export class DrumSet extends Instrument {

    kitPiecesToNoteNames: Map<string, string[]> = new Map<string, string[]>();
    protected sampler: Sampler;
    private panner: Panner;
    protected volumeVal = -7;
    public instrumentName = "Drumset";

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                this.kitPiecesToNoteNames.set("rideCym", new Array() as string[]);
                this.kitPiecesToNoteNames.set("hatChick", new Array() as string[]);
                this.kitPiecesToNoteNames.set("crossStick", new Array() as string[]);
                this.kitPiecesToNoteNames.set("bell", new Array() as string[]);
                this.kitPiecesToNoteNames.set("kick", new Array() as string[]);
                this.kitPiecesToNoteNames.set("snare", new Array() as string[]);
                this.kitPiecesToNoteNames.set("highTom", new Array() as string[]);

                Object.entries(fileConfig).forEach(([noteName, path]) => {
                    if (path.includes("ride")) {
                        this.kitPiecesToNoteNames.get("rideCym").push(noteName);
                    }
                    else if (path.includes("hatChick")) {
                        this.kitPiecesToNoteNames.get("hatChick").push(noteName);
                    }
                    else if (path.includes("crossStick")) {
                        this.kitPiecesToNoteNames.get("crossStick").push(noteName);
                    }
                    else if (path.includes("bell")) {
                        this.kitPiecesToNoteNames.get("bell").push(noteName);
                    }
                    else if (path.includes("highTom")) {
                        this.kitPiecesToNoteNames.get("highTom").push(noteName);
                    }
                    else if (path.includes("snare")) {
                        this.kitPiecesToNoteNames.get("snare").push(noteName);
                    }
                    else if (path.includes("kick")) {
                        this.kitPiecesToNoteNames.get("kick").push(noteName);
                    }
                });

                self.sampler = new Sampler(fileConfig, () => {
                    self.sampler.volume.value = self.volumeVal;
                    self.panner = new Panner().toDestination();
                    self.panner.pan.value = -0.75;
                    self.sampler.connect(self.panner);
                    resolve();
                });
            } catch (error) {
                alert('error loading instrument');
                reject();
            }
        });
    }

    play(soundName: string, startTime: number, duration?: string , velocity?: number): void {
        const noteNames = this.kitPiecesToNoteNames.get(soundName);
        const item = noteNames[Math.floor(Math.random() * noteNames.length)];
        this.sampler.triggerAttack('' + item, startTime, velocity);
    }

    mute(): void {
        if (this.panner) {
            this.panner.disconnect();
        }
    }

    unmute(): void {
        if (this.panner) {
            this.panner.toDestination();
        }
    }

}
