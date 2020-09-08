import { Transport, Loop } from 'tone';
import { Musician } from '../musicians/musician';
import { Drummer } from '../musicians/drummer/drummer';
import { Measure } from '../measure/measure';
import { Bassist } from '../musicians/bassist/bassist';

export class BandService {

    private musicians: Musician[] = [];
    private style = 'fourFourTime';
    private measures: Measure[] = [];
    private initialized = false;

    constructor(private drummer: Drummer, private bassist: Bassist) { }

    public setStyle(style: string) {
        this.style = style;
    }

    public pause() {
        Transport.pause('+0');
    }

    public stop() {
        Transport.stop();
        Transport.cancel(0);
        this.createScheduleLoop();
    }

    public play() {
        Transport.swing = 0.5;
        if (!this.initialized) {
            this.initialize()
                .then(() => Transport.start())
                .catch((e) => alert('Error initializing the band!'));
        } else {
            Transport.start();
        }
    }

    private async initialize(): Promise<void> {
        try {
            await this.drummer.initialize();
            await this.bassist.initialize();
            this.musicians.push(this.drummer);
            this.musicians.push(this.bassist);
            this.createScheduleLoop();
            this.initialized = true;
        } catch (error) {
            throw new Error(`Eror: error occurred when loading band: ${JSON.stringify(error, null, 2)}`);
        }
    }

    private createScheduleLoop() {
        const self = this;

        let currentMeasure = 0;
        const measures: Measure[] = [];
        measures.push(new Measure(1, self.style, [{root: 'D', type: 'min7'}]));
        measures.push(new Measure(2, self.style, [{root: 'G', type: '7'}]));
        measures.push(new Measure(3, self.style, [{root: 'C', type: 'maj7'}]));
        measures.push(new Measure(4, self.style, [{root: 'C', type: 'maj7'}]));

        measures.push(new Measure(5, self.style, [{root: 'D', type: 'min7'}]));
        measures.push(new Measure(6, self.style, [{root: 'G', type: '7'}]));
        measures.push(new Measure(7, self.style, [{root: 'C', type: 'maj7'}]));
        measures.push(new Measure(8, self.style, [{root: 'C', type: 'maj7'}]));

        measures.push(new Measure(9, self.style, [{root: 'D', type: 'min7'}]));
        measures.push(new Measure(10, self.style, [{root: 'G', type: '7'}]));
        measures.push(new Measure(11, self.style, [{root: 'C', type: 'maj7'}]));
        measures.push(new Measure(12, self.style, [{root: 'C', type: 'maj7'}]));

        measures.push(new Measure(13, self.style, [{root: 'D', type: 'min7'}]));
        measures.push(new Measure(14, self.style, [{root: 'G', type: '7'}]));
        measures.push(new Measure(15, self.style, [{root: 'C', type: 'maj7'}]));
        measures.push(new Measure(16, self.style, [{root: 'C', type: 'maj7'}]));

        new Loop(() => {
            if (measures.length <= currentMeasure) {
                return;
            }
            const measure = measures[currentMeasure];
            self.musicians.forEach(musician => musician.play(measure));
            currentMeasure++;
        }, '1m').start(0);
    }
}
