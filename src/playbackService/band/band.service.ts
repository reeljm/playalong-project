import { Transport, Loop } from 'tone';
import { Musician } from '../musicians/musician';
import { Drummer } from '../musicians/drummer/drummer';
import { Measure } from '../song/measure';
import { Bassist } from '../musicians/bassist/bassist';
import { Song } from '../song/song';

export class BandService {

    private musicians: Musician[] = [];
    private style = 'fourFourTime';
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

        const song: Song = new Song();
        song.addMeasure(new Measure(1, self.style, [{root: 'F', type: 'maj7'}], 4));
        song.addMeasure(new Measure(2, self.style, [{root: 'F', type: 'maj7'}], 4));
        song.addMeasure(new Measure(3, self.style, [{root: 'E', type: 'min7b5'}], 4));
        song.addMeasure(new Measure(4, self.style, [{root: 'A', type: '7b9'}], 4));
        song.addMeasure(new Measure(5, self.style, [{root: 'D', type: 'relative min7'}], 4));
        song.addMeasure(new Measure(6, self.style, [{root: 'D', type: 'relative min7'}], 4));
        song.addMeasure(new Measure(7, self.style, [{root: 'C', type: 'min7'}], 4));
        song.addMeasure(new Measure(8, self.style, [{root: 'F', type: '7'}], 4));
        song.addMeasure(new Measure(9, self.style, [{root: 'Bb', type: 'maj7'}], 4));
        song.addMeasure(new Measure(10, self.style, [{root: 'Bb', type: 'min7'}], 4));
        song.addMeasure(new Measure(11, self.style, [{root: 'F', type: 'maj7'}], 4));
        song.addMeasure(new Measure(12, self.style, [{root: 'D', type: 'min7'}], 4));
        song.addMeasure(new Measure(13, self.style, [{root: 'G', type: '7'}], 4));
        song.addMeasure(new Measure(14, self.style, [{root: 'G', type: '7'}], 4));
        song.addMeasure(new Measure(15, self.style, [{root: 'G', type: 'min7'}], 4));
        song.addMeasure(new Measure(16, self.style, [{root: 'C', type: '7'}], 4));
        
        song.addMeasure(new Measure(17, self.style, [{root: 'F', type: 'maj7'}], 4));
        song.addMeasure(new Measure(18, self.style, [{root: 'F', type: 'maj7'}], 4));
        song.addMeasure(new Measure(19, self.style, [{root: 'E', type: 'min7b5'}], 4));
        song.addMeasure(new Measure(20, self.style, [{root: 'A', type: '7b9'}], 4));
        song.addMeasure(new Measure(21, self.style, [{root: 'D', type: 'relative min7'}], 4));
        song.addMeasure(new Measure(22, self.style, [{root: 'D', type: 'relative min7'}], 4));
        song.addMeasure(new Measure(23, self.style, [{root: 'C', type: 'min7'}], 4));
        song.addMeasure(new Measure(24, self.style, [{root: 'F', type: '7'}], 4));
        song.addMeasure(new Measure(25, self.style, [{root: 'Bb', type: 'maj7'}], 4));
        song.addMeasure(new Measure(26, self.style, [{root: 'Bb', type: 'min7'}], 4));
        song.addMeasure(new Measure(27, self.style, [{root: 'F', type: 'maj7'}], 4));
        song.addMeasure(new Measure(28, self.style, [{root: 'D', type: 'min7'}], 4));
        song.addMeasure(new Measure(29, self.style, [{root: 'G', type: '7'}], 4));
        song.addMeasure(new Measure(30, self.style, [{root: 'G', type: '7'}], 4));
        song.addMeasure(new Measure(31, self.style, [{root: 'G', type: 'min7'}], 4));
        song.addMeasure(new Measure(32, self.style, [{root: 'C', type: '7'}], 4));
        
        let currentMeasure = 0;
        new Loop(() => {
            if (song.measures.length <= currentMeasure) {
                return;
            }
            const measure = song.measures[currentMeasure];
            self.musicians.forEach(musician => musician.play(measure));
            currentMeasure++;
        }, '1m').start(0);
    }
}
