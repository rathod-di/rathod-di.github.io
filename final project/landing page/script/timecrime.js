console.log("hi")
d3.csv("data/timecrime.csv").then(function(data) {
    var trace1 = {
      x: data.map(function(d) { return d.time; }),
      y: data.map(function(d) { return d.day; }),
      type: 'bar',
      name: 'Day'
    };
  console.log(trace1)

    var trace2 = {
      x: data.map(function(d) { return d.time; }),
      y: data.map(function(d) { return d.mid_day; }),
      type: 'bar',
      name: 'Mid-Day'
    };
  
    var trace3 = {
      x: data.map(function(d) { return d.time; }),
      y: data.map(function(d) { return d.night; }),
      type: 'bar',
      name: 'Night'
    };
  
    var layout = {
      title: 'Crime Rates by Time of Day',
      xaxis: {
        title: 'Time of Day'
      },
      yaxis: {
        title: 'Crime Rate'
      }
    };
  
    var data = [trace1, trace2, trace3];
  
    Plotly.newPlot('chart', data, layout);
  });
  