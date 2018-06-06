/* Education and Voting Power of Hispanics in the US
** Jonathan Ortiz
** UCSC CMPS 165
*/
// Create title
d3.select("body").append("h1").text("LatinoEducation")


// Width and height
var w = 700;
var h = 600;
var padding = 20;

// for Pie chart
var height = 50;
var width = 50;


// Scale functions
var xScale = d3.scaleLinear()
    .domain([1980, 2015])
    .range([padding * 3, w - padding * 6]);

var yScale = d3.scaleLinear()
    .domain([0, 60000000])
    .range([h - padding * 3, padding]);

// Define X axis
var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(function(d, i) {
      if(i==0 || i==2 || i==4 || i==6 || i==7){
          return d;
      } else {
          return null;
      }
    });

// Define Y axis
var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5);

// Line function
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.value); });

// Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// Create X axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (padding * 2) + "," + (h - (padding * 3)) + ")")
    .call(xAxis);

svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("x", 0 - (h/2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of People");

// Create Y axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (padding * 5) + ",0)")
    .call(yAxis);

svg.append("text")
      .attr("y", h - padding)
      .attr("x", (w/2) + padding)
      .attr("dx", "1em")
      .style("text-anchor", "middle")
      .text("Year");



// Read in the poppopulation data
d3.csv("population.csv",function(error, data){
    // Put data in container
    var pop = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {date: parseFloat(d.date),
                        value: parseFloat(d[id])};
            })
        };
    });

    console.log(pop);

    // Create a g element for each population
    var group = svg.selectAll(".group")
        .data(pop)
        .enter().append("g")
        .attr("class", "group");
    
    // Create path
    var path = group.append("path")
        .attr("class", "line")
        .attr("transform", "translate(" + (padding * 2) + ",0)")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return '#EE2410'; });
    
    // Append group name to end of path
    group.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + xScale(d.value.date) + "," + yScale(d.value.value) + ")"; })
        .attr("x", padding * 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d, i) { 
            if(i == 0){
                return "Total Population";
            }else if(i == 2) {
                return "US Born";
            }else {
                return "Foreign Born";
            }
        });
    
    // Animation
    var totalLength = path.node().getTotalLength();
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    
});

var radius = Math.min(width, height) / 2;

var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .value(function (d) {
        return d.value;
    })
    .sort(null);

var color = d3.scaleOrdinal(d3.schemeCategory10);
// var color = d3.scaleOrdinal()
    // .range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']);

// Read in the education data
d3.csv("education.csv",function(error, data){
    // Put data in container
    var edu = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {date: parseFloat(d.date),
                        value: parseFloat(d[id])};
            })
        };
    });
    console.log(edu);
    
    // Create a g element for each education
    var edugroup = svg.selectAll(".edugroup")
        .data(edu)
        .enter().append("g")
        .attr("class", "edugroup");
    
    // Create path
    var edupath = edugroup.append("path")
        .attr("class", "line")
        .attr("transform", "translate(" + (padding * 2) + ",0)")
        .attr("d", function(d) { return line(d.values); })
        //.style("stroke", function(d) { return '#1D8335'; });
        .style("stroke", function (d) { return color(d.id);});
    
    // Append group name to end of path
    edugroup.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + xScale(d.value.date) + "," + yScale(d.value.value) + ")"; })
        .attr("x", padding * 2)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d, i) { 
            if(i == 0){
                return "HS Dropout";
            }else if(i == 2) {
                return "HS Graduate";
            }else if(i == 3) {
                return "2 year College";
            }else {
                return "4 year College";
            }
        });
    
    // Animation
    var totalLength = edupath.node().getTotalLength();
    edupath
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    
});



d3.csv("education.csv", function (error, data_edu) 
{
    d3.csv("population.csv", function (error, data_pop)
    {
        var pieData = {};
        var total = {};
        //reorder data
        for (var elem of data_pop) 
            total[elem.date] = +elem.total;
        for (elem of data_edu)
        {
            pieData[elem.date] = [
                { label: "dropout", value: elem.dropout },
                { label: "hs", value: elem.hs },
                { label: "comm", value: elem.comm },
                { label: "coll", value: elem.coll }];

        }
        // console.log(pieData);
        // console.log(total);

        for (var key in pieData)
        {
            //create piegroup
            var piegroup = svg.selectAll(".piegroup" + key)
                .data(pie(pieData[key]))
                .enter()
                .append("g")
                .attr("class", "piegroup");
            piegroup
                .append('path')
                .attr('d', arc)
                .attr("transform", "translate(" + (xScale(key) + 35) + "," + (yScale(total[key]) - 0) + ")")
                .attr('fill', function (d, i)
                {
                    return color(d.data.label);
                });
            // .text(function (d)
            // {
            //     return d.data.label;
            // });

            // piegroup.append("text")
            //     .attr("transform", function (d)
            //     {
            //         console.log(label.centroid(d));
            //         return "translate(" + (label.centroid(d)[0] + xScale(key) + 20) + ',' + (label.centroid(d)[1] + yScale(total[key]) - 20) + ")";
            //     })
            //     .attr("dy", "0.35em")
            //     .text(function (d)
            //     {
            //         return d.data.label;
            //     });
        }
    });
    

});