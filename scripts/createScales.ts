(function () {
    const fs = require('fs');

    const scalesToSteps = {
        major:                  [2,2,1,2,2,2],
        melodicMinor:           [2,1,2,2,1,3],
        dorian:                 [2,1,2,2,2,1],  // dorian
        mixolydian:             [2,2,1,2,2,1],
        locrian:                [1,2,2,1,3,1],  // used for min7b5 chords
        wholeHalfDiminished:    [2,1,2,1,2,1],  // used for 7b9 chords
        halfWholeDiminished:    [1,2,1,2,1,2],  // used for 7#9 and dim chords
        naturalMinor:           [2,1,2,2,1,2],
        altered:                [1,2,1,2,2,2],
        wholeTone:              [2,2,2,2,2],    // used for 7#5
        lydianAugmented:        [2,2,2,2,1,2],  // used for maj7#5
        lydian:                 [2,2,2,1,2,2],  // used for maj7#11
        lydianDominant:         [2,2,2,1,2,1],  // used for 7#11
    };

    const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

    const output: any = { };

    Object.entries(scalesToSteps).forEach(([scaleName, intervals]) => {
        for (let i = 0; i < notes.length; i++) {
            const root = notes[i];
            let noteIndex = i;
            const scale: String[] = [];
            scale.push(root);
            intervals.forEach(interval => {
                noteIndex = (noteIndex + interval) % notes.length;
                scale.push(notes[noteIndex]);
            });
            output[`${root}_${scaleName}`] = scale;
        }
    });

    fs.writeFile(`${__dirname}/../src/playbackService/staticFiles/scales.json`, JSON.stringify(output, null, 4), 'utf8', () => {"finished making scales!"});
})();
