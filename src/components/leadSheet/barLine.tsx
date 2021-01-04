import React, { Component } from 'react'

export default class BarLine extends Component {

    render() {
        return (
            <svg className="bar-line" width="30" height="60" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <line
                        stroke-linecap="undefined"
                        stroke-linejoin="undefined"
                        id="svg_6"
                        y2="60"
                        x2="15"
                        y1="0"
                        x1="15"
                        stroke-width="1"
                        stroke="#000"
                        fill="none"/>
                </g>
            </svg>
        )
    }
}
