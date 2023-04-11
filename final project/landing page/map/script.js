const width = window.innerWidth, height = window.innerHeight;
const svg = d3.select("#viz")
            .attr("width", width)
            .attr("height", height);
const map = svg.select("#map");
d3.select("#ocean")
  .attr("width", width)
  .attr("height", height);

let geoJSONFile = "https://gist.githubusercontent.com/jdev42092/5c285c4a3608eb9f9864f5da27db4e49/raw/a1c33b1432ca2948f14f656cc14c7c7335f78d95/boston_neighborhoods.json";

d3.json(geoJSONFile).then(function(ditu) {

    var proj = d3.geoMercator().fitSize([width, height], ditu);
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
                    case "Allston/Brighton":
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