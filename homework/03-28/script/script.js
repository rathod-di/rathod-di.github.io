/* 1. DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS
*/

const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;

const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

/* 
    ADDING A TOOLTIP
        
    We begin by creating a new div element inside the #chart container, 
    giving it class 'tooltip'; note that this newly created div inherits 
    (receives) the CSS properties defined by the .tooltip { ... } rule 
    in the stylesheet.

    This tooltip variable is used later in the code to implement the actual tooltip.
*/
const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip");
    // Load the Gapminder dataset
// REMINDER: d3.csv(), and all other data loading methods in D3 v7, return a "promise" object not a dataset/

// Put the d3.csv() method inside an array because the static method Promise.all() below
// requires an "iterable" object as input argument.
let promise = [d3.csv("./data/cleaned_grouped_data_boston.csv")];
Promise.all(promise).then(function(results){
    // So you need to specify [0], so the functions works with the dataset not an array
    drawScatterPlot(results[0]);
})

function drawScatterPlot(data) {

    /* 
    2. FILTER THE DATA 
    */

    let filtered_data = data.filter(function(d) {
        return d.year === '2023';
    });
}
