d3.csv("../data/gapminder.csv").then(function(data) {
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
  
    // Group the data by year and continent
    const groupedData = d3.group(data, d => d.year, d => d.continent);
  
    // Get the maximum GDP per capita across all years and continents
    const maxGdp = d3.max(data, d => +d.gdpPercap);
  
    const margin = {top: 50, left: 100, right: 50, bottom: 100};
  
    const xScale = d3.scaleBand()
      .domain(groupedData.keys())
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const yScale = d3.scaleLinear()
      .domain([0, maxGdp])
      .range([height - margin.bottom, margin.top]);
  
    const colorScale = d3.scaleOrdinal()
      .domain(groupedData.keys())
      .range(d3.schemeCategory10);
  
    const xAxis = svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom().scale(xScale));
  
    const yAxis = svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(yScale));
  
    const bars = svg.selectAll(".bar")
      .data(groupedData)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", d => `translate(${xScale(d[0])},0)`)
      .selectAll("rect")
      .data(d => d[1])
      .enter()
      .append("rect")
      .attr("x", d => xScale.bandwidth() / d[1].length * d[1].index)
      .attr("y", d => yScale(+d.gdpPercap))
      .attr("width", xScale.bandwidth() / d[1].length)
      .attr("height", d => height - margin.bottom - yScale(+d.gdpPercap))
      .attr("fill", d => colorScale(d[0]));
  
    const xAxisLabel = svg.append("text")
      .attr("class", "axisLabel")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2)
      .text("Year");
  
    const yAxisLabel = svg.append("text")
      .attr("class", "axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left / 2)
      .text("GDP Per Capita");
  });