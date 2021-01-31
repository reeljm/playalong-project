import { Sampler } from 'tone';
import { Instrument } from '../instrument';
import { Note } from '../../theory/note';
import rawData from '../../staticFiles/samples/piano/config.json';
const fileConfig = (rawData as any);

export class Piano extends Instrument {

    static LOWEST_NOTE = Note.getNote("C", 2);
    static HIGHEST_NOTE = Note.getNote("C", 4);

    protected sampler: Sampler;
    protected volumeVal: number = -7;
    public instrumentName = "Piano";

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                self.sampler = new Sampler(fileConfig, () => {
                    self.sampler.volume.value = self.volumeVal;
                    self.sampler.release = 0.75;
                    self.sampler.toDestination();
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
        if (this.sampler) {
            this.sampler.disconnect();
        }
    }

    unmute(): void {
        if (this.sampler) {
            this.sampler.toDestination();
        }
    }
}
