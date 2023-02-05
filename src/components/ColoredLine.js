import React from 'react'

const ColoredLine = ({ color }) => (
    <hr
        style={{
            // color: color,
            backgroundColor: color,
            width:"100%",
            height: 1,
            marginBottom:"10px"
        }}
    />
);

export default ColoredLine
