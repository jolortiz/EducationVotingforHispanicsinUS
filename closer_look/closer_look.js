/* 
** Education and Voting Power of Hispanics in the US
** Jonathan Ortiz
** UCSC CMPS 165
*/

// Runs this d3 code if button is checked
function closer_look() {
  $( ".middlecol" ).empty();
  $( "#bt3" ).prop('disabled', true);
    
  /*** D3 CODE ***/

  // Width and height
  var w = 700;
  var h = 700;
  var padding = 20;

  // Scale functions
  var xScale = d3.scaleLinear()
    .domain([1980, 2015])
    .range([padding * 3, w - padding * 8]);

  var yScale = d3.scaleLinear()
    .domain([0, 8702779])
    .range([h - padding * 3, padding]);

  var z = d3.scaleOrdinal(d3.schemeCategory10);

  var area = d3.area()
    .x(function(d) { return xScale(d.date); })
    .y0(function(d) { return h - padding * 3; })
    .y1(function(d) { return yScale(d.value); });

  // Define X axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(function(d, i) {
      if (i==0 || i==2 || i==4 || i==6 || i==7) {
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
    //.curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.value); });

  // Create SVG element
  var svg = d3.select(".middlecol")
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
    .attr("x", w/2)
    .attr("dx", "1em")
    .style("text-anchor", "middle")
    .text("Year");

  // Read in the education data
  d3.csv("closer_look/education.csv",function(error, data) {
    // Put data in container
    var edu = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {date: parseFloat(d.date), value: parseFloat(d[id])};
        })
      };
    });
    //console.log(edu);

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
      .style("stroke", function(d) { return '##99A3A4'; });

    // Create area
    edugroup.append("path")
      .attr('class', 'area')
      .attr("transform", "translate(" + (padding * 2) + ",0)")
      .attr('d', function(d) { return area(d.values); })
      .style('fill', function(d, i) {
        if(i == 0) {
          return '#E6B0AA';
        } else if(i == 1) {
          return '#AED6F1';
        } else if(i == 2) {
          return '#A2D9CE';
        } else if(i == 3) {
          return '#F9E79F';
        }
      });

    // Append group name to end of path
    edugroup.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) {
        return "translate(" + xScale(d.value.date) + "," + yScale(d.value.value) + ")";
      })
      .attr("x", padding * 2)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d, i) { 
        if(i == 0){
          return "High School Graduates";
        }else if(i == 2) {
          return "4 Year College";
        }else if(i == 3) {
          return "High School Dropout";
        }else {
          return "2 year College";
        }
      });
  });
}