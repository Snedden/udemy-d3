/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/



var margin = {top:10 , bottom: 100, right: 60, left:70}

var width = 800 - margin.right - margin.left;
var height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height+ margin.top + margin.bottom)

var g = svg.append("g")
				.attr("class", "coffeeBarChart")
				.attr("transform", "translate("+margin.left+","+margin.top+")")


var monthLabel = g.append("text")
					.attr("y", height +50)
					.attr("x", width/2)
					.attr("text-anchor","middle")
					.attr("font-size", "20px")
					.text("Month")

var revenueLabel =  g.append("text")
						.attr("transform","rotate(-90)")
						.attr("x",-height/2)
						.attr("y",-50)
						.attr("font-size", "20px")
						.text("Revenue")

d3.json("data/revenues.json").then((data) => {
	console.log("data:", data);

	var monthScale = d3.scaleBand()
						.domain(data.map((d) => {
							return d.month;
						}))
						.range([0,width])
						.paddingInner(0.3)
						.paddingOuter(0.5)


	var revenueScale = d3.scaleLinear()
						.domain([0,d3.max(data, (d) => {
							return d.revenue;
						})])
						.range([height, 0]);

	var profitsScale = d3.scaleLinear()
							.domain([0,d3.max(data, (d) => {
								return d.profit;
							})])
							.range([height, 0])

	var monthAxis = d3.axisBottom(monthScale);											
  var revenuesAxis = d3.axisLeft(revenueScale);
	g.append("g")
		.attr("class", "monthAxis")
		.attr("transform", "translate(0,"+(height)+")")
		.call(monthAxis);

	g.append("g")
		.attr("class", "revenuesAxis")
		.call(revenuesAxis)

console.log("monthScaleBncdwidh", monthScale.bandwidth)

	var bars = g.append("g")
							.attr("class","bars")
							.selectAll("rect")
							.data(data)
							.enter()
							.append("rect")
							.attr("height",(d,i) => {
								return height - revenueScale(d.revenue)
							})
							.attr("width", monthScale.bandwidth)	
							.attr("x", (d,i) => {
								return monthScale(d.month);
							})
							.attr("y", (d,i) => {
								return revenueScale(d.revenue);
							})
							.attr("fill", "#feff00");	

					
});


