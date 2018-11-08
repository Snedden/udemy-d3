/*
*    main.js
*    Mastering Data Visualization with D3.js
*    CoinStats
*/

var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append(g)
    .attr("transform", "translate("+margin.left+","+margin.top+")")

//Scales
var priceScale = d3.scaleLinear()
        .range([height,0])
var timeScale = d3.scaleTime()
        .range([0,width])


//Axis
var xAxis = d3.axisBottom(timeScale)
var yAxis = d3.axisLeft(priceScale)

d3.json("data/coins.json").then((data) => {
    //console.log("data", data);
    var bitCoinData = data.bitcoin;
    var cleanData = bitCoinData.filter((d) => {
       return (d.price_usd)     
    }).map((d) => {
        d.price_usd =+ d.price_usd;
        return d;
    })

    console.log("bitCoinData ",bitCoinData);
    console.log("cleanCoinData ",cleanData);
});
