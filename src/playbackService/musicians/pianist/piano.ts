import { Panner, Sampler } from 'tone';
import { Instrument } from '../instrument';
import { Note } from '../../theory/note';
import rawData from '../../staticFiles/samples/piano/config.json';
const fileConfig = (rawData as any);

export class Piano extends Instrument {
    static LOWEST_NOTE = Note.getNote("C", 2);
    static HIGHEST_NOTE = Note.getNote("C", 4);

    sampler: Sampler;

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                self.sampler = new Sampler(fileConfig, () => {
                    self.sampler.volume.value = -4;
                    self.sampler.release = 0.75;
                    const panner: Panner = new Panner().toDestination();
                    panner.pan.value = 0;
                    self.sampler.connect(panner);
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

}
