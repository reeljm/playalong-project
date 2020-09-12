(function () {
    const fs = require('fs');

    const scalesToSteps = {
        major: [2,2,1,2,2,2,1],
        dorian: [2,1,2,2,2,1,2], // dorian
        mixolydian: [2,2,1,2,2,1,2]
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

    fs.writeFile('../assets/scales/scales.json', JSON.stringify(output, null, 4), 'utf8', () => {"finished making scales!"});
})();
