import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';

export interface BasslineRule {

    getMatch(params: BasslineRequestParams): Note
}
