/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/


var margin ={
	top: 5,
	bottom: 50,
	right: 150,
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

var ageLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x",-height/2)
    .attr("y", -20)
    .attr("font-size",20)
    .text("Age")


var incomeLabel =g.append("text")
    .attr("x", width/2)
    .attr("y", height +50)
    .attr("font-size",20)
    .text("GDP")

var yearLabel = g.append("text")
    .attr("x", width - 50)
    .attr("y", height - 50)
    .attr("font-size", 25)



d3.json("data/data.json").then(function(data){

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

    var maxIncome = d3.max(formattedData , (yearData) => {
                                return d3.max(yearData.countries, (d) => {
                                    //console.log("yearData ", d)
                                    return d.income
                                })
                            });
    var minIncome = d3.min(formattedData , (yearData) =>{
                                    return d3.min(yearData.countries, (d) => {
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


    var toolTip = d3.tip().attr("class", "d3-tip")
    	.html((d) => {
    		var text = "<strong>Country:</strong><span style='color:red'>" +d.country+"</span></br>";
    		text += "<strong>Continent:</strong><span style='color:red,text-transform:capitalize'" +d.continent+"</span></br>";
    		text += "<strong>GDP:</strong><span style='color:red'>" + d3.format("$,.0f")(d.income)+"</span></br>";
    		text += "<strong>Life Expentency:</strong><span style='color:red'>" +d3.format("1.1f")(d.life_exp)+"</span></br>";
    		text += "<strong>Population:</strong><span style='color:red'>" +d3.format(",.0f")(d.population)+"</span></br>";
    		return text
    	})

    g.call(toolTip);	
	 // console.log("formattedData ",formattedData);

    //Scales
    var populationScale = d3.scaleLinear()
                            .domain([0, maxPopulation])
                            .range([0,width ]);

    var gdpScale = d3.scaleLog()
		.base(10)
		.domain([minIncome, maxIncome])
		.range([0,width ]);

    var lifeExpScale = d3.scaleLinear()
		.domain([0,maxlifeExpt])
		.range([height,0])
    //Axis
    var xAxis = d3.axisBottom(gdpScale)
        .tickFormat((d) => {
			return d + "$";
		})
		.tickValues([200,1000,8000,20000,182668]);
    xAxisGroup.call(xAxis);
    var yAxis = d3.axisLeft(lifeExpScale);
    yAxisGroup.call(yAxis);
    //Other Data
	var numberOfCountries = 100;
	var countries = formattedData[0].countries.map((d) => {
		return d.country;
	})
	var continents = []
	formattedData[0].countries.map((d,i,a) => {
        if(!continents.includes(d.continent)) {
        	continents.push(d.continent);
		}
	});

	var countryColorScale = d3.scaleOrdinal()
		.domain(continents)
        .range(d3.schemePastel1)

    var countryLegends = g.append("g")
        .attr("id", "countryLegends")
        .attr("transform", "translate("+width+","+margin.top+")")
        .selectAll("g")
        .data(continents)
        .enter()
        .append("g");

	countryLegends.append("rect")
			.attr("width", 10)
			.attr("x",0)
        	.attr("y",(d,i) => (i*15 - 10))
			.attr("height", 10)
			.attr("fill" ,(d,i) => {return countryColorScale(d)});
 
    countryLegends.append("text")
        .attr("x",15)
        .attr("y",(d,i) => i*15)
        .text("text-anchor", "")
		.text((d )=> d)
    var i = 0;

   var interval =  d3.interval(() => {
   			if(i< formattedData.length){
   				update(formattedData[i]);	
   				i++;
   			}
   			else{
   				interval.stop();
   				return;
   			}
        
        
        },100);

    function update(yearData){
        yearLabel.text(yearData.year);
        var t = d3.transition()
            .duration(100);
        //console.log("yearData ",yearData);
        // JOIN new data with old elements.
        var circles = g.selectAll("circle").data(yearData.countries, function(d){
            return d.country;
        });

        // EXIT old elements not present in new data.
        circles.exit()
            .attr("class", "exit")
            .remove();
        circles
            .enter()
            .append("circle")
            .attr("fill",(d,i) => {return countryColorScale(d.continent)})
            .attr("stroke", "black")
            .attr("fill-opacity","0.5")
            .on("mouseover",toolTip.show)
            .on("mouseout", toolTip.hide)
            .merge(circles)
                .attr("cx",(d) => { return gdpScale(d.income)})
                .attr("cy",(d) => { return lifeExpScale(d.life_exp)})
                .attr("r", (d =>  {return populationScale(d.population/2)}));




        }
    });



