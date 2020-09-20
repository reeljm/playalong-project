import { Transport, Loop } from 'tone';
import { Musician } from '../musicians/musician';
import { Drummer } from '../musicians/drummer/drummer';
import { Measure } from '../song/measure';
import { Bassist } from '../musicians/bassist/bassist';
import { Song } from '../song/song';
import { Chord } from '../theory/chord';

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
        Transport.bpm.value = 150;
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
        const numChoruses: number = 1;
        const chorusLength: number = 32;

        let i = 0;
        for (i = 0; i < numChoruses * chorusLength; i = i + chorusLength) {
            // satin doll:
            song.addMeasure(new Measure(1 + i, self.style, [new Chord('D','min7'), new Chord('D', 'min7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            song.addMeasure(new Measure(2 + i, self.style, [new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            song.addMeasure(new Measure(3 + i, self.style, [new Chord('E', 'min7'), new Chord('E', 'min7'), new Chord('A', '7'), new Chord('A', '7')], 4));
            song.addMeasure(new Measure(4 + i, self.style, [new Chord('E', 'min7'), new Chord('E', 'min7'), new Chord('A', '7'), new Chord('A', '7')], 4));
            song.addMeasure(new Measure(5 + i, self.style, [new Chord('A', 'min7'), new Chord('A', 'min7'), new Chord('D', '7'), new Chord('D', '7')], 4));
            song.addMeasure(new Measure(6 + i, self.style, [new Chord('Ab', 'min7'), new Chord('Ab', 'min7'), new Chord('Db', '7'), new Chord('Db', '7')], 4));
            song.addMeasure(new Measure(7 + i, self.style, [new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('D', 'min7'), new Chord('D', 'min7')], 4));
            song.addMeasure(new Measure(8 + i, self.style, [new Chord('E', 'min7'), new Chord('E', 'min7'), new Chord('A', '7'), new Chord('A', '7')], 4));
            
            song.addMeasure(new Measure(9 + i, self.style, [new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            song.addMeasure(new Measure(10 + i, self.style, [new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            song.addMeasure(new Measure(11 + i, self.style, [new Chord('E', 'min7'), new Chord('E', 'min7'), new Chord('A', '7'), new Chord('A', '7')], 4));
            song.addMeasure(new Measure(12 + i, self.style, [new Chord('E', 'min7'), new Chord('E', 'min7'), new Chord('A', '7'), new Chord('A', '7')], 4));
            song.addMeasure(new Measure(13 + i, self.style, [new Chord('A', 'min7'), new Chord('A', 'min7'), new Chord('D', '7'), new Chord('D', '7')], 4));
            song.addMeasure(new Measure(14 + i, self.style, [new Chord('Ab', 'min7'), new Chord('Ab', 'min7'), new Chord('Db', '7'), new Chord('Db', '7')], 4));
            song.addMeasure(new Measure(15 + i, self.style, [new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('C', 'maj7')], 4));
            song.addMeasure(new Measure(16 + i, self.style, [new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('C', 'maj7')], 4));
            
            song.addMeasure(new Measure(17 + i, self.style, [new Chord('G', 'min7'), new Chord('G', 'min7'), new Chord('C', '7'), new Chord('C', '7')], 4));
            song.addMeasure(new Measure(18 + i, self.style, [new Chord('G', 'min7'), new Chord('G', 'min7'), new Chord('C', '7'), new Chord('C', '7')], 4));
            song.addMeasure(new Measure(19 + i, self.style, [new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7')], 4));
            song.addMeasure(new Measure(20 + i, self.style, [new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7')], 4));
            song.addMeasure(new Measure(21 + i, self.style, [new Chord('A', 'min7'), new Chord('A', 'min7'), new Chord('D', '7'), new Chord('D', '7')], 4));
            song.addMeasure(new Measure(22 + i, self.style, [new Chord('A', 'min7'), new Chord('A', 'min7'), new Chord('D', '7'), new Chord('D', '7')], 4));
            song.addMeasure(new Measure(23 + i, self.style, [new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            song.addMeasure(new Measure(24 + i, self.style, [new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            
            song.addMeasure(new Measure(25 + i, self.style, [new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            song.addMeasure(new Measure(26 + i, self.style, [new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            song.addMeasure(new Measure(27 + i, self.style, [new Chord('E', 'min7'), new Chord('E', 'min7'), new Chord('A', '7'), new Chord('A', '7')], 4));
            song.addMeasure(new Measure(28 + i, self.style, [new Chord('E', 'min7'), new Chord('E', 'min7'), new Chord('A', '7'), new Chord('A', '7')], 4));
            song.addMeasure(new Measure(29 + i, self.style, [new Chord('A', 'min7'), new Chord('A', 'min7'), new Chord('D', '7'), new Chord('D', '7')], 4));
            song.addMeasure(new Measure(30 + i, self.style, [new Chord('Ab', 'min7'), new Chord('Ab', 'min7'), new Chord('Db', '7'), new Chord('Db', '7')], 4));
            song.addMeasure(new Measure(31 + i, self.style, [new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('C', 'maj7')], 4));
            song.addMeasure(new Measure(32 + i, self.style, [new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('C', 'maj7'), new Chord('C', 'maj7')], 4));


            // another you
            // song.addMeasure(new Measure(1 + i, self.style, [new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7')], 4));
            // song.addMeasure(new Measure(2 + i, self.style, [new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7')], 4));
            // song.addMeasure(new Measure(3 + i, self.style, [new Chord('E', 'min7b5'), new Chord('E', 'min7b5'), new Chord('E', 'min7b5'), new Chord('E', 'min7b5')], 4));
            // song.addMeasure(new Measure(4 + i, self.style, [new Chord('A', '7b9'), new Chord('A', '7b9'), new Chord('A', '7b9'), new Chord('A', '7b9')], 4));
            // song.addMeasure(new Measure(5 + i, self.style, [new Chord('D', 'relative min7'), new Chord('D', 'relative min7'), new Chord('D', 'relative min7'), new Chord('D', 'relative min7')], 4));
            // song.addMeasure(new Measure(6 + i, self.style, [new Chord('D', 'relative min7'), new Chord('D', 'relative min7'), new Chord('D', 'relative min7'), new Chord('D', 'relative min7')], 4));
            // song.addMeasure(new Measure(7 + i, self.style, [new Chord('C', 'min7'), new Chord('C', 'min7'), new Chord('C', 'min7'), new Chord('C', 'min7')], 4));
            // song.addMeasure(new Measure(8 + i, self.style, [new Chord('F', '7'), new Chord('F', '7'), new Chord('F', '7'), new Chord('F', '7')], 4));
            // song.addMeasure(new Measure(9 + i, self.style, [new Chord('Bb', 'maj7'), new Chord('Bb', 'maj7'), new Chord('Bb', 'maj7'), new Chord('Bb', 'maj7')], 4));
            // song.addMeasure(new Measure(10 + i, self.style, [new Chord('Bb', 'min7'), new Chord('Bb', 'min7'), new Chord('Bb', 'min7'), new Chord('Bb', 'min7')], 4));
            // song.addMeasure(new Measure(11 + i, self.style, [new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7')], 4));
            // song.addMeasure(new Measure(12 + i, self.style, [new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('D', 'min7')], 4));
            // song.addMeasure(new Measure(13 + i, self.style, [new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            // song.addMeasure(new Measure(14 + i, self.style, [new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            // song.addMeasure(new Measure(15 + i, self.style, [new Chord('G', 'min7'), new Chord('G', 'min7'), new Chord('G', 'min7'), new Chord('G', 'min7')], 4));
            // song.addMeasure(new Measure(16 + i, self.style, [new Chord('C', '7'), new Chord('C', '7'), new Chord('C', '7'), new Chord('C', '7')], 4));
            
            // song.addMeasure(new Measure(17 + i, self.style, [new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7')], 4));
            // song.addMeasure(new Measure(18 + i, self.style, [new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7')], 4));
            // song.addMeasure(new Measure(19 + i, self.style, [new Chord('E', 'min7b5'), new Chord('E', 'min7b5'), new Chord('E', 'min7b5'), new Chord('E', 'min7b5')], 4));
            // song.addMeasure(new Measure(20 + i, self.style, [new Chord('A', '7b9'), new Chord('A', '7b9'), new Chord('A', '7b9'), new Chord('A', '7b9')], 4));
            // song.addMeasure(new Measure(21 + i, self.style, [new Chord('D', 'relative min7'), new Chord('D', 'relative min7'), new Chord('D', 'relative min7'), new Chord('D', 'relative min7')], 4));
            // song.addMeasure(new Measure(22 + i, self.style, [new Chord('D', 'relative min7'), new Chord('D', 'relative min7'), new Chord('D', 'relative min7'), new Chord('D', 'relative min7')], 4));
            // song.addMeasure(new Measure(23 + i, self.style, [new Chord('C', 'min7'), new Chord('C', 'min7'), new Chord('C', 'min7'), new Chord('C', 'min7')], 4));
            // song.addMeasure(new Measure(24 + i, self.style, [new Chord('F', '7'), new Chord('F', '7'), new Chord('F', '7'), new Chord('F', '7')], 4));
            // song.addMeasure(new Measure(25 + i, self.style, [new Chord('Bb', 'maj7'), new Chord('Bb', 'maj7'), new Chord('Bb', 'maj7'), new Chord('Bb', 'maj7')], 4));
            // song.addMeasure(new Measure(26 + i, self.style, [new Chord('Bb', 'min7'), new Chord('Bb', 'min7'), new Chord('Bb', 'min7'), new Chord('Bb', 'min7')], 4));
            // song.addMeasure(new Measure(27 + i, self.style, [new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7'), new Chord('F', 'maj7')], 4));
            // song.addMeasure(new Measure(28 + i, self.style, [new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('D', 'min7'), new Chord('D', 'min7')], 4));
            // song.addMeasure(new Measure(29 + i, self.style, [new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            // song.addMeasure(new Measure(30 + i, self.style, [new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7'), new Chord('G', '7')], 4));
            // song.addMeasure(new Measure(31 + i, self.style, [new Chord('G', 'min7'), new Chord('G', 'min7'), new Chord('G', 'min7'), new Chord('G', 'min7')], 4));
            // song.addMeasure(new Measure(32 + i, self.style, [new Chord('C', '7'), new Chord('C', '7'), new Chord('C', '7'), new Chord('C', '7')], 4));
        }
        const firstChord = song.measures[0].chords[0];
        song.addMeasure(new Measure(song.measures.length + 1, self.style, [new Chord(firstChord.root, firstChord.type),new Chord(firstChord.root, firstChord.type),new Chord(firstChord.root, firstChord.type),new Chord(firstChord.root, firstChord.type)], 4));

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
