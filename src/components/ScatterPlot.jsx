import React, { useRef, useMemo, useCallback } from "react"


import { scaleLinear, scaleSqrt, scaleOrdinal } from "@visx/scale";
import { extent, format, max, min } from "d3";

import { Circle } from "@visx/shape";
import { Group } from "@visx/group";

import { Axis, AxisLeft } from "@visx/axis";

import { ScaleSVG } from '@visx/responsive';

import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip"
import { localPoint } from "@visx/event"
import { voronoi } from "@visx/voronoi"

const ScatterPlot = ({
  data,
  width = 700,
  height = 300,
  margin = { top: 10, left: 60, right: 40, bottom: 40 },
}) => {

  const x = (d) => +d.zri_st;
  const y = (d) => +d.rent_burden;
  const r = (d) => +d.pop_total;

  const xScale = scaleLinear({
    range: [margin.left, width - margin.right - margin.left],
    domain: extent(data, x),
  });

  const yScale = scaleLinear({
    range: [height - margin.bottom - margin.top, margin.top],
    domain: extent(data, y),
    nice: true,
  });

  const rScale = scaleLinear({
    range: [3, 50],
    domain: extent(data, r),
    nice: true,
  });

  // const radius = (d) => d.population

  // Tooltip code

  const myStyles = Object.assign({}, defaultStyles, {
    zIndex: "100",
  });

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipOpen,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip();

  const voronoiLayout = useMemo(
    () =>
      voronoi({
        x: (d) => xScale(x(d)) ?? 0,
        y: (d) => yScale(y(d)) ?? 0,
        width,
        height,
      })(data),
    [data, width, height, xScale, yScale]
  )

  let tooltipTimeout;
  const svgRef = useRef(null);

  const handleMouseMove = useCallback(
    (event) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)
      if (!svgRef.current) return

      const point = localPoint(svgRef.current, event)
      if (!point) return
      const neighborRadius = 100
      const closest = voronoiLayout.find(point.x, point.y, neighborRadius)
      if (closest) {
        showTooltip({
          tooltipLeft: xScale(x(closest.data)),
          tooltipTop: yScale(y(closest.data)),
          tooltipData: closest.data,
        })
      }
    },
    [xScale, yScale, showTooltip, voronoiLayout, tooltipTimeout]
  )

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip()
    }, 1500)
  }, [hideTooltip])

  // End tooltip code

  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
          fill="transparent"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseLeave}
        />
        <AxisLeft scale={yScale} left={margin.left} label='Rent Burden' />
        <Axis
          orientation='bottom'
          scale={xScale}
          top={height - margin.bottom - margin.top}
          label='ZRI Index'
        />
        <Group pointerEvents='none'>
          {data.map((point, i) => (
            <Circle
              key={i}
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              r={rScale(r(point))}
              fill={tooltipData === point ? "orange" : "#69306D"}     
              fillOpacity={tooltipData === point ? 1 : 0.7}   
            />
          ))}
        </Group>
      </svg>
            {
        tooltipOpen && tooltipData && tooltipLeft != null && tooltipTop != null && (
          <TooltipWithBounds
            left={tooltipLeft + 10}
            top={tooltipTop + 10}
            style={myStyles}
          >
            <h3>
              {tooltipData.NAME}
            </h3>
            <div>
            <p>{tooltipData.pop_total}</p>
            </div>
          </TooltipWithBounds>
        )
      }
      </div>
  )
}

export default ScatterPlot