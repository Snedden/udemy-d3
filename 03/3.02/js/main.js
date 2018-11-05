/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.2 - Linear scales
*/

var svg = d3.select("#chart-area")
    .append("svg")
        .attr("width", "400")
        .attr("height", "400");

d3.json("data/buildings.json").then(function(data){
    console.log(data);
    var buildNames = [];
    data.forEach(d => {
        d.height = +d.height;
        buildNames.push(d.name);

    });
    console.log("buildNames ",buildNames );
    var x = d3.scaleBand()
                .domain(buildNames)
                .range([0,400])
                .paddingInner(0.2)
                .paddingOuter(0.4)
    console.log(x("Burj Khalifa"));
    var y = d3.scaleLinear()
        .domain([0, 828])
        .range([0, 400]);

    var rects = svg.selectAll("rect")
            .data(data)
        .enter()
            .append("rect")
            .attr("y", 0)
            .attr("x", function(d, i){
                return x(d.name);
            })
            .attr("width", x.bandwidth)
            .attr("height", function(d){
                return y(d.height);
            })
            .attr("fill", function(d) {
                return "grey";
            });

});



