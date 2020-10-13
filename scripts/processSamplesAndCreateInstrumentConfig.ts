// params:
// path to folder to process
// starting note C1
//



(function () {
    const fs = require('fs');
    const instrumentName = process.argv[2];
    const startingNote = process.argv[3];
    const startingOctave = Number.parseInt(process.argv[4]);
    const sampleDir = `./src/playbackService/staticFiles/samples/${instrumentName}`;

    const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    const output: any = { };
    let notesIndex = notes.indexOf(startingNote);
    let currentOctave:number = startingOctave;
    fs.readdir(sampleDir, (err: any, files: any[]) => {
        files.sort((a: string, b: string) => {
            const aNum = Number.parseInt(a.split("_")[1]);
            const bNum = Number.parseInt(b.split("_")[1]);
            if (aNum > bNum) {
                return 1;
            } else if (aNum < bNum) {
                return -1;
            } else {
                return 0;
            }
        });
        files.forEach((file: any) => {
            const fileName = `${notes[notesIndex].replace("#","s")}_${currentOctave}.wav`;
            const fullFileName = `${sampleDir}/${fileName}`;
            console.log(`${sampleDir}/${file}` + " to " + fileName);
            fs.rename(`${sampleDir}/${file}`, `${sampleDir}/${fileName}`, (e:any) =>{ console.log(e);});
            output[`${notes[notesIndex]}${currentOctave}.wav`] = fullFileName;
            const prevIndex = notesIndex;
            notesIndex = (notesIndex + 1) % 12;
            if (prevIndex > notesIndex) {
                currentOctave++;
            }
        });
        fs.writeFile(`${__dirname}/../src/playbackService/staticFiles/samples/${instrumentName}/config.json`, JSON.stringify(output, null, 4), 'utf8', () => {"finished making scales!"});
    });


})();
