import React from "react";

import { scaleLinear, scaleSqrt, scaleOrdinal } from "@visx/scale";
import { extent, format, max, min } from "d3";

import { Circle } from "@visx/shape"
import { Group } from "@visx/group"

import { Axis, AxisLeft } from "@visx/axis"

const ScatterPlot = ({
  data,
  width = 800,
  height = 500,
  margin = { top: 30, left: 60, right: 40, bottom: 40 },
}) => {
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  console.log("DATA IS ", data);

  const x = (d) => +d.zri_st;
  const y = (d) => +d.rent_burden;

  const xScale = scaleLinear({
    range: [margin.left, innerWidth + margin.left],
    domain: extent(data, x),
  })

  const yScale = scaleLinear({
    range: [innerHeight + margin.top, margin.top],
    domain: extent(data, y),
    nice: true,
  })

  // const radius = (d) => d.population

  return (
    <svg width={innerWidth} height={innerHeight}>
      <AxisLeft scale={yScale} left={margin.left} label='Rent Burden' />
      <Axis
        orientation='bottom'
        scale={xScale}
        top={innerHeight + margin.bottom}
        label='ZRI Index'
      />
      <Group pointerEvents='none'>
        {data.map((point, i) => (
          <Circle
            key={i}
            cx={xScale(x(point))}
            cy={yScale(y(point))}
            r={2}
            fill={"red"}
          />
        ))}
      </Group>
    </svg>
  )
}

export default ScatterPlot