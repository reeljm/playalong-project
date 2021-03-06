import React, { Component } from 'react'

interface IRootProps {
    note: string;
}

export default class Root extends Component<IRootProps> {

    render() {
        return (
            <svg className="chord-root" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <text
                        xmlSpace="preserve"
                        textAnchor="start"
                        fontFamily="Helvetica, Arial, sans-serif"
                        fontSize="43.636363"
                        id="svg_1"
                        y="39.272727"
                        x="5"
                        strokeWidth="0"
                        stroke="#000"
                        fill="#000000">
                            {this.props.note}
                    </text>
                </g>
            </svg>
        )
    }
}
