/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.2 - Looping with intervals
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var x,y,xAxisCall,yAxisCall,isRevenue; 
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var t = d3.transition().duration(750);  
          

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
var yLabel = g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

      

d3.json("data/revenues.json").then(function(data){
    // console.log(data);
    isRevenue = true;
    // Clean data
    data.forEach(function(d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    // X Scale
    x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);

    // Y Scale
    y = d3.scaleLinear()
        .range([height, 0]);



    



    d3.interval(function(){
        var newData = isRevenue ? data : data.slice(1);
        update(newData)
        
        isRevenue = !isRevenue;
    }, 1000);
});

function update(data){
    var yValue = isRevenue?"revenue":"profit";
    x.domain(data.map(function(d){ return d.month }))
    y.domain([0, d3.max(data, function(d) { return d[yValue] })])

    yLabel.text(yValue);

    // X Axis
    xAxisCall = d3.axisBottom(x);


    // Y Axis
    yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return "$" + d; });

    yAxisGroup
        .transition(t)
        .call(yAxisCall);

    xAxisGroup
        .transition(t)
        .call(xAxisCall);    

    // Bars
    var circles = g.selectAll("circle")
        .data(data, (d) => {
            return d.month ; //use as key instead of index, helps in adding remove data
        })
        

    // Remove old elments not present in new data    
    circles.exit()
            .attr("fill", "red")
            .transition(t)
            .attr("r", 0)
            .attr("cy", y(0))
            .remove()    

    // Update old elements present in the new data
/*    circles
        .transition(t)
        .attr("y", function(d){ return y(d[yValue]); })
        .attr("x", function(d){ return x(d.month) })
        .attr("height", function(d){ return height - y(d[yValue]); })
        .attr("width", x.bandwidth)*/


    //Append new elements     
    circles.enter()
        .append("circle")
            .attr("cy", function(d){ return y(d[yValue]); })
            .attr("cx", function(d){ return x(d.month) + x.bandwidth()/2 })
            .attr("r", function(d){ return (height - y(d[yValue]))/20; })
            .attr("fill", "grey")
        .merge(circles)
            .transition(t)
            .attr("cy", function(d){ return y(d[yValue]); })
            .attr("cx", function(d){ return x(d.month) + x.bandwidth()/2 })
            .attr("r", function(d){ return (height - y(d[yValue]))/20; }) ;

}







