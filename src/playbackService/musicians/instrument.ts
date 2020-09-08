import { Sampler } from 'tone';

export abstract class Instrument {

    sampler: Sampler;

    static build<T extends Instrument>(constructorFn: new () => T): Promise<Instrument> {
        return new Promise((resolve, reject) => {
            const instrument = new constructorFn();
            instrument.loadInstrument()
                .then(() => {
                    resolve(instrument);
                })
                .catch(() => {
                    reject();
                });
        });
    }

    abstract loadInstrument(): Promise<void>;

    abstract play(soundName: string, startTime: number, duration?: string , velocity?: number): void;

}
