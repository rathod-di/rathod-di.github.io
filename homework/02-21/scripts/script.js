/*

ARTG5330 Visualization Technolgies 1
February 21,2023
Spring Semester
Week 7

*/

















































































































































































/*
4. CREATE SCALES
We'll use the computed min and max values to create scales for
our scatter plot.
    - What does d3.scaleLinear() do?
    The .scaleLinear() function in D3 is a JavaScript function that
    accepts an input and returns an output such that the input and output
    are linearly correlated: it establishes a LINEAR MAP between values
    given in one domain, to values given in another domain. For purposes
    of visualization, this function is very common because it helps transform
    data values to visual variables such as position, length, or color. In order
    to use this function properly, you must specify a domain and a range.
    Please refer to these nice explanations/tutorials: 
        https://medium.com/@mbostock/introducing-d3-scale-61980c51545f
        https://jckr.github.io/blog/2011/08/11/d3-scales-and-color/
    - What does d3.scaleBand() do?
    It constructs a band scale. This function is deployed for charts like the one
    we use in this demonstration that consists of ordinal or categorical variables,
    i.e., a fixed set of years. The horizontal axis must be somehow mapped into our 
    screen's range, which is made up of pixels. Thus, we provide a domain in which
    our years are sorted in ascending order and the range is the chart's width in pixels
    that evenly distributes the bars among the years. We also add a `padding` to
    separate the bars by a small gap. You could specify more explicitly the inner padding
    and the outerpadding using the methods .paddingInner() and .paddingOuter().
    - What is the purpose of the .padding() in d3.scaleBand()?
    See above answer. 
    - For each scale below, what does the domain
        represent, and what does the range represent?
    For xScale, the domain represents the input to the bar chart's horizontal
    axis which is a set of specific years. The range is a continuous range
    defined using the variables margin and width we defined above for controlling
    the size and positioning of the chart in the browser.
    For yScale, the domain and range are continuous sets of values.
    - For each scale below, how many values are in
        the domain and range?
    For xScale, the domain contains 12 values and the range is uncountable.
    For yScale, both the domain and range are uncountable.
*/

const margin = {
    top: 50,
    left: 100,
    right: 50,
    bottom: 100
};


const xScale = d3.scaleBand()
.domain(["1952","1957","1962","1967","1972","1977","1982","1987","1992","1997","2002","2007"])
.range([margin.left, width-margin.right])
.padding(0.5);

const yScale = d3.scaleLinear()
.domain([50, lifeExp.max])
.range([height-margin.bottom, margin.top]);

/*
5. DRAW AXES
The following chunks of code draw 2 axes -- an x- an y-axis.
        - The "g" element:
        The "g" element creates a new DOM element that is appended
        to an svg container. This element will contain the axes for
        our visualization.
        - The "transform" attribute:
        It "pushes" upwards the position of the horizontal axis by
        calculating the difference between `height` and `margin.bottom`.
        It is essentially a method of positioning the axis element.
        - The d3.axisBottom() and d3.axisLeft() methods:
        The .axisBottom() is a built-in D3 function that draws a bottom
        horizontal axis and the .axisLeft() is a built-in D3 function that
        draws a left vertical axis. D3 axes are made of lines, ticks, and
        labels.
    */
//.attr("transform",`translate(0,5 {height-margin,bottom})`)

        const xAxis = svg.append("g")
            .attr("class","axis")
            .attr("transform", `translate(0,${height-margin.bottom})`)
            .call(d3.axisBottom().scale(xScale));
    
        const yAxis = svg.append("g")
            .attr("class","axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft().scale(yScale));
    
        /*
         6. DRAW BARS
    In this bar chart, each bar will represent a single year for the United States;
    the horizontal position of the bar will represent the year of data,
    vand the height of the bar will represent the life expectancy for that year.
    The following chunk of code is the standard D3 data join pattern.
        - What is the purpose of the pattern svg.selectAll().data().enter().append()?
        This is a standard pattern for joining data with D3. 
        The purpose of this pattern is to JOIN data with DOM elements, 
        such as SVG basic shapes (e.g., rect). The pattern starts with
        .selectALl() that selects all the currently existing shapes and
        binds them with the provided dataset using .data(). Then,
        you use .enter() to check what ADDITIONAL shapes you must
        create/append to complete the binding. For example, if you
        have NO SHAPES of the type "rect" in the beginning, then
        .enter().append("rect") will append as many rectangles as
        needed to bind all the data points in your dataset. If you have
        1 "rect" and 3 data points, then it will append 2 missing
        "rect" shapes to complete the binding. Essentially, .enter()
        tells you which data points are missing a corresponding DOM
        element. 
        - Each attribute defined below is defined using things called
            "accessor functions." In each accessor function, what is
            the parameter named `d` a reference to?
        A row in your CSV dataset.
        - Inside each accessor function, what is the purpose of
            each "return ___;" statement?
        
        To return a value that can be associated with the given variable. 
        You need an accessor function in order to go through all the available
        data points.
        - What does xScale.bandwidth() compute? How is that value being used here?
        The .bandwidth() method returns the width of each band in your xScale
        and it is used to provide a width to your rectangles. Here, the width
        is a constant value.
        - What is going on with the calculation for the "height" attribute?
            Explain how the expression inside the accessor function for this
            attribute works.
        
        It is a linear expression that determines the height of a rectangle. The
        function yScale() returns the point on the Y axis for each data point. Remember
        that the coordinate system's origin is the top left point of the screen. So,
        a positive y coordinate is taken from top to bottom. You also have a margin
        that provides gaps around your chart (e.g., you put the axes' titles in those
        gaps). If you simply take height - margin.bottom, then the height of each
        rectangle will not take account of margin.bottom. So, you need to subtract
        that value as well so that your rectangle starts from the point you take
        from yScale(d.lifeExp) and extends until it hits the x-axis. 
        
        Tip: Use the consolo.log() to compute and print each of the components of this 
        linear expression separately, to understand how all of this works. This is also 
        a good exercise for understanding how the coordinate system works in an SVG canvas.
    */

    const points = svg.selectAll("rect")
    .data(filtered_data)
    .enter()
    .append("rect")
        .attr("x", function(d) { return xScale(d.year); })
        .attr("y", function(d) { return yScale(d.lifeExp); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - (margin.bottom + yScale(d.lifeExp)); })
        .attr("fill", "steelblue");

/*
7. DRAW AXIS LABELS
    The chunks of code below draw text labels for the axes.
    Examine the yAxisLabel. What is going on with the 
    "transform", "x", and "y" attributes, in terms of
    how their values are computed to control the rotated
    placement of the label?
    For `yAxisLabel`, the tricky point is understanding how
    the coordinate system works. Here, the negative `x` value controls
    how the axis label moves from TOP TO BOTTOM. The positive `y` value
    controls how it moves from LEFT TO RIGHT.
    The `transform` attribute controls the rotation of the axis label
    by taking as the origin the top left point of the screen. Note,
    a rotation by -90 is a clockwise rotation.
    As before, to understand how all of this works use the console.log()
    print method to test each of the computations separately.
    */

    const xAxisLabel = svg.append("text")
    .attr("class","axisLabel")
    .attr("x", width/2)
    .attr("y", height-margin.bottom/2)
    .text("Year");

const yAxisLabel = svg.append("text")
    .attr("class","axisLabel")
    .attr("transform","rotate(-90)")
    .attr("x", -height/2)
    .attr("y", margin.left/2)
    .text("Life Expectancy (Years)");

});
