import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';

export interface BasslineRule {

    getMatch(params: BasslineRequestParams): BasslineResponseParams
}
