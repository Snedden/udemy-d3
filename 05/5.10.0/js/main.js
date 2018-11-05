/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/


var margin ={
	top: 5,
	bottom: 50,
	right: 50,
	left: 50
}

var width = 800 - margin.right - margin.left;
var height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
					.append("svg")
					.attr("width", width + margin.right + margin.left )
					.attr("height", height + margin.top + margin.bottom)

var g = svg.append("g")
				.attr("id","populationGraph")
				.attr("transform", "translate("+margin.left+","+margin.top+")")

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");								 

d3.json("data/data.json").then(function(data){
	   // Clean data
	   /*
    const formattedData = data.map(function(year){
        return year["countries"].filter(function(country){
            var dataExists = (country.income && country.life_exp);
            return dataExists
        }).map(function(country){
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            return country;            
        })
    });*/
	// Clean data
	const formattedData = data.map((year) => {


			var d = year["countries"].filter((country) => {
	  		var dataExists =  country.income && country.population 
	  		return dataExists;
	  	}).map((country) => {
	  		 country.income = +country.income;
	  		 country.life_exp = +country.life_exp;
	  		 country.population = +country.population;
	  		 return country;
	  	})
	  	var year = +year.year;
	  	var yearData = {
	  		countries : d,
	  		year : year
	  	}
	  	return yearData; 
	});

  var maxIncome = d3.max(formattedData , (yearData) =>{
										return d3.max(yearData.countries, (d) => {
											//console.log("yearData ", d)
											return d.income
										})
									});

  var maxPopulation = d3.max(formattedData , (yearData) =>{
										return d3.max(yearData.countries, (d) => {
											//console.log("yearData ", d)
											return d.population
										})
									});

  var maxlifeExpt = d3.max(formattedData , (yearData) =>{
										return d3.max(yearData.countries, (d) => {
											//console.log("yearData ", d)
											return d.life_exp
										})
									});

  console.log("Max ",maxPopulation)

  console.log("formattedData ",formattedData);
  console.log("formattedData ",formattedData[1800]); 
	var populationScale = d3.scaleLinear()
									.domain([0, maxPopulation])
									.range([0,width ]);

	var gdpScale = d3.scaleLinear()
									.domain([0, maxIncome])
									.range([height,0 ]); 	

	
 var xAxis = d3.axisBottom(populationScale);
 xAxisGroup.call(xAxis);

 var yAxis = d3.axisLeft(gdpScale);
 yAxisGroup.call(yAxis);				


})