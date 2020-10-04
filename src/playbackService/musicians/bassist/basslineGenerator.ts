import { Measure } from '../../song/measure';
import { Theory } from '../../theory/theory';

export abstract class BasslineGenerator {

    constructor(protected theory: Theory) { }

    public abstract gerenateBasslineEventParams(currentMeasure: Measure): any[]

}
