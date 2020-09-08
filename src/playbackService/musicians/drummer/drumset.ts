import { Sampler } from 'tone';
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
                    "C1": "./src/playbackService/staticFiles/samples/drums/ride_1.mp3",
                    "D1": "./src/playbackService/staticFiles/samples/drums/ride_2.mp3",
                    "E1": "./src/playbackService/staticFiles/samples/drums/ride_3.mp3",
                    "F1": "./src/playbackService/staticFiles/samples/drums/ride_4.mp3",
                    "G1": "./src/playbackService/staticFiles/samples/drums/hatChick_1.mp3",
                    "A1": "./src/playbackService/staticFiles/samples/drums/crossStick_1.mp3"
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

                self.sampler = new Sampler(fileConfig, () => {
                    resolve();
                }).toDestination();
                self.sampler.volume.value = -20;
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
