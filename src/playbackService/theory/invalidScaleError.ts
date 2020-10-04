export class InvalidScaleError extends Error {

    public constructor(scaleName: string) {
        super(`Scale ${scaleName} does not exist`);
    }

}