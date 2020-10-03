export class InvalidPitchError extends Error {

    public constructor(pitch: string) {
        super(`Unable to parse the given pitch ${pitch} because it is invalid`);
    }

}