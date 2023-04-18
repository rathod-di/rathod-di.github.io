const width = window.innerWidth, height = window.innerHeight;
const svg = d3.select("#viz")
            .attr("width", width)
            .attr("height", height);
const map = svg.select("#map");

// Define the data for the pie chart
const pieData = Array.from({length: 10}, (_, i) => i + 1);

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
.on("click", function(d, i) {
  // Handle click events on pie slices
  console.log(`Clicked on slice ${i + 1}`);
  // Get the name of the neighborhood clicked on
  const neighborhood = d.data;
  // Define the data for the bar chart
  const barData = [20, 30, 40, 50, 60];
  // Create the SVG container for the pop-up
  const popUp = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);
  // Create the bars for the bar chart
  const barGroup = popUp.selectAll("rect")
    .data(barData)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 30)
    .attr("y", height / 2)
    .attr("width", 20)
    .attr("height", (d) => d)
    .attr("fill", "steelblue");
  // Create the text labels for the bar chart
  const textGroup = popUp.selectAll("text")
    .data(barData)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 30 + 10)
    .attr("y", (d) => height / 2 + d + 15)
    .attr("text-anchor", "middle")
    .text((d) => d);
  // Create a background rectangle for the pop-up
  const bgRect = popUp.insert("rect", ":first-child")
    .attr("x", -width / 4)
    .attr("y", -height / 4)
    .attr("width", width / 2)
    .attr("height", height / 2)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 1);
 
  // Add a close button to the pop-up
  const closeButton = popUp.append("text")
    .attr("x", width / 4 - 10)
    .attr("y", -height / 4 + 20)
    .attr("text-anchor", "end")
    .style("cursor", "pointer")
    .text("X")
    .on("click", function() {
      popUp.remove();
    });

  // Add the neighborhood name to the title of the chart
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text(neighborhood);
});

d3.select("#ocean")
  .attr("width", width)
  .attr("height", height);

let geoJSONFile = "https://gist.githubusercontent.com/jdev42092/5c285c4a3608eb9f9864f5da27db4e49/raw/a1c33b1432ca2948f14f656cc14c7c7335f78d95/boston_neighborhoods.json";

d3.json(geoJSONFile).then(function(ditu) {

    var proj = d3.geoMercator().scale(90000).center([-71.257, 42.363]);
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
    function zoomed(e) {
        map.attr("transform", e.transform);
    };

    let zoom = d3.zoom()
       
        .translateExtent([[0, 0], [width, height]])

        .scaleExtent([1, 30])
        .on("zoom", zoomed);

    svg.call(zoom);

});