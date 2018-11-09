/*
*    main.js
*    Mastering Data Visualization with D3.js
*    CoinStats
*/

//Margin
var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

//Svg containers
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
var g = svg.append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")")

//Scales
var priceScale = d3.scaleLinear()
        .range([height,0])
var timeScale = d3.scaleTime()
        .range([0,width])

//data
var data;

//Axis
var xAxisCall = d3.axisBottom(timeScale)
    .ticks(5)
var xAxis = g.append("g")
    .attr("class","xAxis")
    .attr("transform","translate(0,"+height+")")

var yAxisCall = d3.axisLeft(priceScale)
var yAxis = g.append("g")
    .attr("class","yAxis")

//Time formatter and parsers
var parsedDate = d3.timeParse("%d/%m/%Y");
var formatDate = d3.timeFormat("%B %Y");

//line
g.append("path")
    .attr("class","line")
    .attr("stroke","grey")
    .attr("stroke-fill","none")
    .attr("stroke-width","3px")

//transition
var duration = 300;
var t = d3.transition(duration);

//Get data
d3.json("data/coins.json").then((d) => {
    
    data = d;
    update($("#coin-select").val());
    //Selector
    $("#coin-select").change(function() {
        //console.log(this);
        update(this.value)
    })
    
});

function update(coinType){

    var coinData = data[coinType];
    var cleanData = coinData.filter((d) => {
       return (d.price_usd)     
    }).map((d) => {
        d.price_usd =+ d.price_usd;
        d.market_cap =+ d.market_cap;
        d.date = parsedDate(d.date);
        return d;
    })

    priceScale.domain(d3.extent(cleanData.map((d) => d.price_usd)));
    yAxisCall.scale(priceScale);
    yAxis.call(yAxisCall);

    timeScale.domain(d3.extent(cleanData.map((d)=>  d.date)))
    xAxisCall.scale(timeScale).tickFormat((d) => formatDate(d))
    xAxis.call(xAxisCall)

    var line = d3.line()
        .x((d) => timeScale(d.date))
        .y((d) => priceScale(d.price_usd))

    g.select(".line")
        .transition(t)
        .attr("d",line(cleanData))    

    console.log("bitCoinData ",d3.extent(cleanData.map((d)=>  d.date)));
}
