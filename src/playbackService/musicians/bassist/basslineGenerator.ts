import { Measure } from '../../song/measure';
import { Theory } from '../../theory/theory';
import { BasslineCurrentState } from './basslineCurrentState';

export abstract class BasslineGenerator {

    constructor(protected theory: Theory) { }

    public abstract gerenateBasslineEventParams(currentMeasure: Measure, basslineCurrentState: BasslineCurrentState): any[]

}
