import { Transport, Loop } from 'tone';
import { Musician } from '../musicians/musician';
import { Drummer } from '../musicians/drummer/drummer';
import { Measure } from '../song/measure';
import { Bassist } from '../musicians/bassist/bassist';
import { Song } from '../song/song';
import { Theory } from '../theory/theory';

export class BandService {

    private musicians: Musician[] = [];
    private style = 'fourFourTime';
    private initialized = false;

    constructor(private drummer: Drummer, private bassist: Bassist, private theory: Theory) { }

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
        Transport.bpm.value = 250;
        Transport.context.resume();
        if (!this.initialized) {
            this.initialize()
            .then(() => Transport.start());
        } else {
            Transport.start();
        }
    }

    private async initialize(): Promise<void> {
        await this.drummer.initialize();
        await this.bassist.initialize();
        this.musicians.push(this.drummer);
        this.musicians.push(this.bassist);
        this.createScheduleLoop();
        this.initialized = true;
    }

    private setTransportBasedOnPreviousMeasure(previousMeasure: Measure) {
        if (previousMeasure && previousMeasure.style === 'fourFourTime') {
            Transport.swing = 0.5;
        } else {
            Transport.swing = 0;
        }
    }

    private createScheduleLoop() {
        const self = this;

        const song: Song = new Song();
        const numChoruses: number = 3;
        const chorusLength: number = 16;

        let i = 0;
        let numChorus = 0;
        for (i = 0; i < numChoruses * chorusLength; i = i + chorusLength) {
            //another you
            song.addMeasure(new Measure(1 + i, self.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4));
            song.addMeasure(new Measure(2 + i, self.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4));
            song.addMeasure(new Measure(3 + i, self.style, [this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5')], 4));
            song.addMeasure(new Measure(4 + i, self.style, [this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9')], 4));
            song.addMeasure(new Measure(5 + i, self.style, [this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7')], 4));
            song.addMeasure(new Measure(6 + i, self.style, [this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7')], 4));
            song.addMeasure(new Measure(7 + i, self.style, [this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7')], 4));
            song.addMeasure(new Measure(8 + i, self.style, [this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4));
            song.addMeasure(new Measure(9 + i, self.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7')], 4));
            song.addMeasure(new Measure(10 + i, self.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7')], 4));
            song.addMeasure(new Measure(11 + i, self.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4));
            song.addMeasure(new Measure(12 + i, self.style, [this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7')], 4));
            song.addMeasure(new Measure(13 + i, self.style, [this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4));
            song.addMeasure(new Measure(14 + i, self.style, [this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4));
            song.addMeasure(new Measure(15 + i, self.style, [this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7')], 4));
            song.addMeasure(new Measure(16 + i, self.style, [this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4));







            // satin doll:
            // song.addMeasure(new Measure(1 + i, self.style, [this.theory.getChord('D','min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
            // song.addMeasure(new Measure(2 + i, self.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
            // song.addMeasure(new Measure(3 + i, self.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
            // song.addMeasure(new Measure(4 + i, self.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
            // song.addMeasure(new Measure(5 + i, self.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
            // song.addMeasure(new Measure(6 + i, self.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4));
            // song.addMeasure(new Measure(7 + i, self.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7')], 4));
            // song.addMeasure(new Measure(8 + i, self.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));

            // song.addMeasure(new Measure(9 + i, self.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
            // song.addMeasure(new Measure(10 + i, self.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
            // song.addMeasure(new Measure(11 + i, self.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
            // song.addMeasure(new Measure(12 + i, self.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
            // song.addMeasure(new Measure(13 + i, self.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
            // song.addMeasure(new Measure(14 + i, self.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4));
            // song.addMeasure(new Measure(15 + i, self.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));
            // song.addMeasure(new Measure(16 + i, self.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));

            // song.addMeasure(new Measure(17 + i, self.style, [this.theory.getChord('G', 'min7'), this.theory.getChord('G', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4));
            // song.addMeasure(new Measure(18 + i, self.style, [this.theory.getChord('G', 'min7'), this.theory.getChord('G', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4));
            // song.addMeasure(new Measure(19 + i, self.style, [this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7')], 4));
            // song.addMeasure(new Measure(20 + i, self.style, [this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7')], 4));
            // song.addMeasure(new Measure(21 + i, self.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
            // song.addMeasure(new Measure(22 + i, self.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
            // song.addMeasure(new Measure(23 + i, self.style, [this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
            // song.addMeasure(new Measure(24 + i, self.style, [this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));

            // song.addMeasure(new Measure(25 + i, self.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
            // song.addMeasure(new Measure(26 + i, self.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
            // song.addMeasure(new Measure(27 + i, self.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
            // song.addMeasure(new Measure(28 + i, self.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
            // song.addMeasure(new Measure(29 + i, self.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
            // song.addMeasure(new Measure(30 + i, self.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4));
            // song.addMeasure(new Measure(31 + i, self.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));
            // song.addMeasure(new Measure(32 + i, self.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));



            // Bb Blues
            // song.addMeasure(new Measure(1 + i, self.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4));
            // song.addMeasure(new Measure(2 + i, self.style, [this.theory.getChord('Eb','7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4));
            // song.addMeasure(new Measure(3 + i, self.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4));
            // song.addMeasure(new Measure(4 + i, self.style, [this.theory.getChord('F','min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4));
            // song.addMeasure(new Measure(5 + i, self.style, [this.theory.getChord('Eb','7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4));
            // song.addMeasure(new Measure(6 + i, self.style, [this.theory.getChord('E','7b9'), this.theory.getChord('E', '7b9'), this.theory.getChord('E', '7b9'), this.theory.getChord('E', '7b9')], 4));
            // song.addMeasure(new Measure(7 + i, self.style, [this.theory.getChord('D','7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
            // song.addMeasure(new Measure(8 + i, self.style, [this.theory.getChord('A','7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
            // song.addMeasure(new Measure(9 + i, self.style, [this.theory.getChord('C','min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7')], 4));
            // song.addMeasure(new Measure(10 + i, self.style, [this.theory.getChord('F','7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4));
            // song.addMeasure(new Measure(11 + i, self.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb','7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'),], 4));
            // song.addMeasure(new Measure(12 + i, self.style, [this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4));

            numChorus++;
        }
        const firstChord = song.measures[0].chords[0];
        song.addMeasure(new Measure(song.measures.length + 1, self.style, [this.theory.getChord(firstChord.root, firstChord.type),this.theory.getChord(firstChord.root, firstChord.type),this.theory.getChord(firstChord.root, firstChord.type),this.theory.getChord(firstChord.root, firstChord.type)], 4));

        let currentMeasure: number = 0;
        let previousMeasure: Measure = null;
        new Loop(() => {
            if (song.measures.length <= currentMeasure) {
                return;
            }
            this.setTransportBasedOnPreviousMeasure(previousMeasure);
            const measure = song.measures[currentMeasure];
            measure.style = this.style;
            
            self.musicians.forEach(musician => musician.play(measure));
            currentMeasure++;
            previousMeasure = measure;
        }, '1m').start(0);
    }
}
