import React, { Component } from 'react'

export default class DoubleBarLine extends Component {

    render() {
        return (
            <svg className="bar-line" width="30" height="60" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <line
                        strokeLinecap="square"
                        
                        id="svg_6"
                        y2="60"
                        x2="9.5"
                        y1="0"
                        x1="9.5"
                        strokeWidth="1"
                        stroke="#000"
                        fill="none"/>

                    <line
                        strokeLinecap="square"
                        
                        id="svg_6"
                        y2="60"
                        x2="21.5"
                        y1="0"
                        x1="21.5"
                        strokeWidth="1"
                        stroke="#000"
                        fill="none"/>
                </g>
            </svg>
        )
    }
}
