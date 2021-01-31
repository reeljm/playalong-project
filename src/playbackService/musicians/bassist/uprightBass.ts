import { Panner, Sampler } from 'tone';
import { Instrument } from '../instrument';
import { Note } from '../../theory/note';
import rawData from '../../staticFiles/samples/upright-bass/config.json';
const fileConfig = (rawData as any);

export class UprightBass extends Instrument {
    static LOWEST_NOTE = Note.getNote("E", 1);
    static HIGHEST_NOTE = Note.getNote("B", 3);

    protected sampler: Sampler;
    private panner: Panner;
    protected volumeVal = 5;
    public instrumentName = "Bass";

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                self.sampler = new Sampler(fileConfig, () => {
                    self.sampler.volume.value = self.volumeVal;
                    self.panner = new Panner().toDestination();
                    self.panner.pan.value = 0.75;
                    self.sampler.connect(self.panner);
                    resolve();
                });
            } catch (error) {
                alert('error loading instrument');
                reject();
            }
        });
    }

    play(soundName: string, startTime: number, duration?: string, velocity?: number): void {
        this.sampler.triggerAttackRelease(soundName, duration, startTime, velocity);
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
