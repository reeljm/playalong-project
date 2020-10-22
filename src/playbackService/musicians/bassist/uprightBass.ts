import { Panner, Sampler } from 'tone';
import { Instrument } from '../instrument';
import { Note } from '../../theory/note';
import rawData from '../../staticFiles/samples/upright-bass/config.json';
const fileConfig = (rawData as any);

export class UprightBass extends Instrument {
    static LOWEST_NOTE = Note.getNote("E", 1);
    static HIGHEST_NOTE = Note.getNote("B", 3);

    sampler: Sampler;

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                self.sampler = new Sampler(fileConfig, () => {
                    self.sampler.volume.value = 6;
                    const panner: Panner = new Panner().toDestination();
                    panner.pan.value = 0.75;
                    self.sampler.connect(panner);
                    console.log("bass has loaded!");
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
