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

//Data
var cleanData = {}; 

//Scales
var priceScale = d3.scaleLinear()
        .range([height,0])
var timeScale = d3.scaleTime()
        .range([0,width])

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
var duration = 1000;
//var t = d3.transition().duration(duration);
var t = function(){ return d3.transition().duration(1000).ease(d3.easeLinear);; }



// Add jQuery UI slider
$("#date-slider").slider({
    range: true,
    max: parsedDate("31/10/2017").getTime(),
    min: parsedDate("12/5/2013").getTime(),
    step: 86400000, // One day
    values: [parsedDate("12/5/2013").getTime(), parsedDate("31/10/2017").getTime()],
    slide: function(event, ui){
        $("#dateLabel1").text(formatDate(new Date(ui.values[0])));
        $("#dateLabel2").text(formatDate(new Date(ui.values[1])));
        update();
    }
});

//Get data
d3.json("data/coins.json").then((data) => {

    //Default selections
    var coinType = 'bitcoin';
    var selectedVar = 'price_usd';


    //console.log("original data", data.bitcoin);
    for(var coinType in data){
        cleanData[coinType] = data[coinType].filter((d) => {
            return (d.price_usd)
        }).map((d) => {
            var obj = {};
            obj.price_usd =+ d.price_usd;
            obj.market_cap =+ d.market_cap;
            obj["24h_vol"] =+ d["24h_vol"];
            obj.date = parsedDate(d.date);
        return obj;
        });
    }

    //coin Selector listener
    $("#coin-select").change(function() {
        update();
    });

    //var Selector listener
    $("#var-select").change(function() {
        update();
    })

    update();
});

function update(){
   
    var coinType = $("#coin-select").val();
    var selectedVar = $("#var-select").val();

    var sliderValues = $("#date-slider").slider("values");
    var dataTimeFiltered = cleanData[coinType].filter(function(d){
        return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
    });

    console.log("cleanData ", cleanData);
    priceScale.domain(d3.extent(dataTimeFiltered.map((d) => d[selectedVar])));
    yAxisCall.scale(priceScale);
    yAxisCall.tickFormat((x) => {
        var sig2 = d3.format(".2s");
        return sig2(x);
    })
    yAxis.transition(t).call(yAxisCall);

      // Fix for format values
    var formatSi = d3.format(".2s");
    function formatAbbreviation(x) {
      var s = formatSi(x);
      switch (s[s.length - 1]) {
        case "G": return s.slice(0, -1) + "B";
        case "k": return s.slice(0, -1) + "K";
      }
      return s;
    }

    timeScale.domain(d3.extent(dataTimeFiltered.map((d)=>  d.date)));
    xAxisCall.scale(timeScale).tickFormat((d) => formatDate(d));
    xAxis.call(xAxisCall);

    var line = d3.line()
        .x((d) => timeScale(d.date))
        .y((d) => priceScale(d[selectedVar]));

    g.select(".line")
        .transition(t)
        .attr("d",line(dataTimeFiltered));    

    //console.log("bitCoinData ",d3.extent(coinData.map((d)=>  d.date)));
}
