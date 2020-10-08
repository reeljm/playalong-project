import { Compressor, Panner, Sampler } from 'tone';
import { Instrument } from '../instrument';

export enum KitPiece {
    RideCym = 'ride-cym',
    HatChick = 'hat-chick',
    CrossStick = 'cross-stick'
}

export class DrumSet extends Instrument {

    sampler: Sampler;
    kitPiecesToNoteNames: Map<string, string[]> = new Map<string, string[]>();

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                const fileConfig = {
                    "C1": "./src/playbackService/staticFiles/samples/drums/ride_1.wav",
                    "D1": "./src/playbackService/staticFiles/samples/drums/ride_2.wav",
                    "E1": "./src/playbackService/staticFiles/samples/drums/ride_3.wav",
                    "F1": "./src/playbackService/staticFiles/samples/drums/hatChick_1.wav",
                    "G1": "./src/playbackService/staticFiles/samples/drums/hatChick_2.wav",
                    "A1": "./src/playbackService/staticFiles/samples/drums/crossStick_1.wav",
                    "B1": "./src/playbackService/staticFiles/samples/drums/crossStick_2.wav",
                    "C2": "./src/playbackService/staticFiles/samples/drums/crossStick_3.wav"
                };

                this.kitPiecesToNoteNames.set("rideCym", new Array() as string[]);
                this.kitPiecesToNoteNames.set("hatChick", new Array() as string[]);
                this.kitPiecesToNoteNames.set("crossStick", new Array() as string[]);

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
                });

                self.sampler = new Sampler(fileConfig, () => resolve());
                self.sampler.volume.value = -7;
                const panner: Panner = new Panner().toDestination();
                panner.pan.value = -0.75;
                this.sampler.connect(panner);
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

}
