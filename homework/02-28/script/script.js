d3.csv("data/gapminder.csv", function(data) {
  // Convert year and gdpPercap to numbers
  data.forEach(function(d) {
    d.year = +d.year;
    d.gdpPercap = +d.gdpPercap;
  });

  // Group data by year and continent
  var nestedData = d3.group(data, d => d.year, d => d.continent);

  // Get unique continents
  var continents = d3.map(data, function(d){return(d.continent)}).keys()

  // Define x and y scales
  var x = d3.scaleBand()
    .domain(d3.map(data, function(d){return(d.year)}).keys())
    .range([0, width])
    .padding([0.2]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){return(d.gdpPercap)})])
    .range([height, 0]);

  // Define color scale
  var color = d3.scaleOrdinal()
    .domain(continents)
    .range(d3.schemeCategory10);

  // Create bars
  svg.append("g")
    .selectAll("g")
    .data(nestedData)
    .join("g")
      .attr("fill", function(d) { return color(d[0]); })
    .selectAll("rect")
    .data(function(d) { return d[1]; })
    .join("rect")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.gdpPercap); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.gdpPercap); });

  // Add x and y axes
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));
});