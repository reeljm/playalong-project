import React, { Component } from 'react'
import { Chord as ChordData } from '../../playbackService/theory/chord'
import Root from './root';
import TypeSmall from './typeSmall';

interface IChordProps {
    chord: ChordData;
}

export default class Chord extends Component<IChordProps> {

    private static SVG_MAP: Map<string, string> = new Map([
        ["A", "A"],
        ["B", "B"],
        ["C", "C"],
        ["D", "D"],
        ["E", "E"],
        ["F", "F"],
        ["G", "G"],
        ["#", "#"],
        ["b", "b"],
        ["1", "1"],
        ["5" ,"5"],
        ["7" ,"7"],
        ["9" ,"9"],
        ["dim" ,"○"],
        ["alt" ,"alt"],
        ["maj" ,"△"],
        ["Maj" ,"△"],
        ["min" ,"-"],
        ["relative min" ,"-"]
    ]);

    private static SVG_LOCATION: string = "./assets/svgs/";

    render() {
        // Render the root:
        const chordTokens: string[] = this.props.chord.writtenRoot.split("");
        const toRender: JSX.Element[] = chordTokens.map((e: string) => {
            let className: string = "";
            if (e === "b" || e === "#") {
                className="chord-symbol";
                return <TypeSmall symbol={ e }/>
            } else {
                className="chord-root"
                return <Root note={ e }/>;
            }
        });

        // Render the type:
        let type: string = this.props.chord.type;
        while (type.length > 0) {
            let replaced: boolean = false;
            for (const entry of Array.from(Chord.SVG_MAP.entries())) {
                const key: string = entry[0];
                const value: string = entry[1];

                if (type.startsWith(key)) {
                    toRender.push(<TypeSmall symbol={ value }/>);
                    type = type.replace(key, "");
                    replaced = true;
                }
            }
            if (!replaced) {
                console.log("unable to find symbol for chord", this.props.chord.type);
                break;
            }
        }
        return <div className="chord"> { toRender } </div>;
    }
}
