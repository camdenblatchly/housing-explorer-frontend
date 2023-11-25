const ScatterPlotWrapper = () => (
  <ParentSize>
    {({ width, height }) => <ScatterPlot width={width} height={height} />}
  </ParentSize>
)