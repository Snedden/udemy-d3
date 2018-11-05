/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

d3.json("data/buildings.json").then((data) => {
	data.forEach((d) => {
		d.height = + d.height;
	})

	d3.select("#chart-area")
	  .append("svg")
	  	.attr("width",800)
	  	.attr("height",800)
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
			.attr("x", (d,i) => {
				return i * 50
			})
			.attr("y", (d) => {
				return (400 - d.height);
			})
			.attr("width", () => {
				return 40
			})
			.attr("height", (d) => {
				return d.height;
			})
			.attr("fill", "grey")
}).catch( (error) => {
	consolo.log(error);
})

