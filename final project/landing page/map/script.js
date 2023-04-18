const width = window.innerWidth, height = window.innerHeight;
const svg = d3.select("#viz")
            .attr("width", width)
            .attr("height", height);
const map = svg.select("#map");

// Define a function to highlight the selected region on the map
function highlightRegion(region) {
  map.selectAll("path")
    .attr("fill", function(d) {
      if (d.properties.Name === region) {
        return "yellow";
      } else {
        return "gray";
      }
    });}


// Load data from the csv file
d3.csv("../data/FINAL_DATA_BOSTON_WITH_TIME.csv").then(function(data) {

  // Define the data for the pie chart
const pieData = Array.from(d3.group(data, d => d.Areas), ([key, value]) => ({ key, value }));

  // Calculate the radius of the pie chart
  const pieRadius = Math.min(width/1.5, height) * 0.3;

  // Calculate the center of the pie chart
  const pieCenter = [width / 2.1, height / 2];

  // Create a pie generator with equal slices
  const pie = d3.pie().value(() => 1)(pieData);

  // Create an SVG group for the pie chart
  const pieGroup = svg.append("g")
    .attr("transform", `translate(${pieCenter[0]}, ${pieCenter[1]})`);

  // Add the pie slices to the pie chart
  pieGroup.selectAll("path")
    .data(pie)
    .enter()
    .append("path")
    .text(function(d) { return d.data.key; })
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .attr("d", d3.arc()
      .innerRadius(80)
      .outerRadius(pieRadius)
    )
    .attr("fill", function(d, i) {
      return d3.schemeCategory10[i % 10];
    })
    .attr("transform", function(d, i) {
      // Position each pie slice side by side
      const angle = (d.startAngle + d.endAngle) / 2;
      const x = (pieRadius / 2) * Math.cos(angle);
      const y = (pieRadius / 2) * Math.sin(angle);
      return `translate(${x}, ${y}) rotate(${90})`;
    })

// Handle click events on pie slices
.on("click", function(event, d) {
  pieGroup.selectAll("path")
    .attr("stroke", null)
    .attr("stroke-width", null);

  // Set the stroke and stroke-width of the clicked pie slice
  d3.select(this)
    .attr("stroke", "black")
    .attr("stroke-width", "2");
    

  // Highlight the corresponding region on the map
  const area = d.data.key;
  highlightRegion(area);
  const barData = Array.from(d3.group(data.filter(d => d.Areas === area), d => d['Crimes Major']))
  .map(d => {
    return {
      category: d[0],
      value: d[1].length
    }; })



// Define the margins and dimensions for the bar chart
const margin = {top: 20, right: 30, bottom: 30, left: 40};
const barWidth = (width - margin.left - margin.right) / barData.length;
const barHeight = height - margin.top - margin.bottom;

// Define the scales for the bar chart
const xScale = d3.scaleBand()
.domain(barData.map(d => d.category))
.range([margin.left, width/4 - margin.right/2])
.padding(0.1);

const yScale = d3.scaleLinear()
.domain([0, d3.max(barData, d => d.value)])
.nice()
.range([height/2 - margin.bottom, margin.top/2]);

// Create the SVG container for the bar chart
const barSvg = d3.select("#graph")
.append("svg")
.attr("width", width/4)
.attr("height", height/1.78);

// Continuing from the last line of code:
// Add a close button for the bar
barSvg.append("text")
  .attr("x", width/4 - 15)
  .attr("y", 20)
  .attr("text-anchor", "end")
  .text("X")
  .style("font-size", "24px")
  .style("cursor", "pointer")
  .on("click", function() {
    barSvg.remove();
    pieGroup.selectAll("path")
    .attr("stroke", null)
    .attr("stroke-width", null);

  // Set the stroke and stroke-width of the clicked pie slice
  d3.select(this)
    .attr("stroke", "black")
    .attr("stroke-width", "2");
  });

// Add the bars to the bar chart
const barGroup = barSvg.append("g")
  .selectAll("rect")
  .data(barData)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.category))
  .attr("y", d => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => barHeight/2 - yScale(d.value))
  .attr("fill", function(d, i) {
    return d3.schemeCategory10[i % 10];
  });

  barSvg.append("text")
  .attr("x", width/8)
  .attr("y", margin.top + 10)
  .text(`Crimes in ${area}`)
  .attr("text-anchor", "middle")
  .attr("font-size", "20px")
  .attr("font-weight", "bold");

  barSvg.append("text")
  .attr("x", 0)
  .attr("y", -30)
  .text(`Crimes in ${area}`)
  .attr("text-anchor", "middle")
  .attr("font-size", "50px")
  .attr("font-weight", "bold");

// Add the x-axis to the bar chart
barSvg.append("g")
  .attr("transform", `translate(0, ${height/1.97 - margin.bottom})`)
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-45)");

// Add the y-axis to the bar chart
barSvg.append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(d3.axisLeft(yScale));

// Add a label for the x-axis
barSvg.append("text")
  .attr("transform", `translate(${width / 4}, ${height - margin.bottom})`)
  .attr("text-anchor", "middle")
  .text("Major Crimes");

// Add a label for the y-axis
barSvg.append("text")
  .attr("transform", `translate(${margin.left}, ${height}) rotate(-90)`)
  .attr("text-anchor", "middle")
  .text("Number of Incidents");
});   
});
    d3.select("#ocean")
    .attr("width", width)
    .attr("height", height);

    let geoJSONFile = "https://gist.githubusercontent.com/jdev42092/5c285c4a3608eb9f9864f5da27db4e49/raw/a1c33b1432ca2948f14f656cc14c7c7335f78d95/boston_neighborhoods.json";

    d3.json(geoJSONFile).then(function(ditu) {

        var proj = d3.geoMercator().scale(70000).center([-71.265, 42.373]);
        var path = d3.geoPath().projection(proj);

        map.selectAll("path")
            .data(ditu.features)
            .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", function(d) {
                    // Color the regions based on their names
                    switch (d.properties.Name) {
                        case "South End":
                            return "red";
                        case "East Boston":
                            return "blue";
                        case "Allston-Brighton":
                            return "green";
                        case "Mattapan":
                            return "purple";
                        case "North End":
                            return "orange";
                        case "Roxbury":
                            return "yellow";
                        case "South Boston":
                            return "brown";
                        case "Dorchester":
                            return "pink";
                        case "Hyde Park":
                            return "gray";
                        case "West Roxbury":
                            return "teal";
                        default:
                            return "#FCEDDA";
                    }
                })
                .attr("vector-effect", "non-scaling-stroke")
                .attr("stroke", "#FC766AFF")
                .attr("stroke-width", "1px");
    
        var points = [
            {"name": "Boston", "coords": [-71.057, 42.313]}
        ];
        
        //function zoomed(e) {
        //    map.attr("transform", e.transform);
        //};

        //let zoom = d3.zoom()
        
        //    .translateExtent([[0, 0], [width, height]])

        //    .scaleExtent([1, 30])
        //    .on("zoom", zoomed);

        //svg.call(zoom);

    });