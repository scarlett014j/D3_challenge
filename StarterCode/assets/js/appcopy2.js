var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  left: 50,
  bottom: 60,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var charts = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(csvData){
  csvData.forEach(function(data) {
    data.income = +data.income;
    data.obesity = +data.obesity;
  });

  var min_income = d3.min(csvData, d => d.income);
  var max_income = d3.max(csvData, d => d.income);

  var xLinear_scale = d3.scaleLinear()
    .domain([min_income - (min_income/10), max_income + (max_income / 10)])
    .range([0, width]);

  var min_obese = d3.min(csvData, d => d.obesity);
  var max_obese = d3.max(csvData, d => d.obesity);

  var yLinear_scale = d3.scaleLinear()
    .domain([min_obese - (min_obese / 10), max_obese + (max_obese / 10)])
    .range([height, 0]);

  var bottom_axis = d3.axisBottom(xLinear_scale);
  var left_axis = d3.axisLeft(yLinear_scale);

  charts.append("g").attr("transform", `translate(0, ${height})`).call(bottom_axis);

  charts.append("g").call(left_axis);

  charts.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-size", "18")
    .text("Population Obesity Rate");
  
  charts.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .attr("font-size", "15")
    .text("Income");
    
  var circlesGroup = charts.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinear_scale(d.income))
    .attr("cy", d => yLinear_scale(d.obesity))
    .attr("r", "9")
    .attr("fill", "blue");  

  charts.append('g')
    .selectAll("text")
    .data(csvData)
    .enter()
    .append("text")
    .attr("x", d => xLinear_scale(d.income))
    .attr("y", d => yLinear_scale(d.obesity))
    .attr("font-size", "9")
    .attr("fill", "white")
    .attr("dx", "-0.7em")
    .attr("dy", "0.4em")
    .text(d => d.abbr);

  var toolTip = d3.select("#scatter").append("div")
    .attr("class", "tooltip");

  circlesGroup.on("mouseover", function(d) {
    toolTip.style("display", "block");
    toolTip.style("background-color", "dimgrey");
    toolTip.style("color", "white");
    toolTip.style("opacity", "1");
    toolTip.style("text-align", "center");
    toolTip.style("font-size", "11px");
    toolTip.html(`${d.state} <br> Obesity Rate: ${d.obesity}% <br> Income: $${d.income}`)
      .style("left", (xLinearScale(d.income) + 80) + "px")
      .style("top", (yLinearScale(d.obesity) + 20) + "px");
  })
  .on("mouseout", function() {
    toolTip.style("display", "none");
  });
})