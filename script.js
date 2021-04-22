async function scatterPlot() {
	
	// Access data
	
	const dataset = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
	console.log(dataset);
	const yearParser = d3.timeParse("%Y");
	const xAccessor = d => yearParser(d.Year);
	const timeParser = d3.timeParse("%M:%S");
	const yAccessor = d => timeParser(d.Time);
	const dopeAccessor = d => d.Doping;

	// Create dimensions
	const height = 900;
	const width = height;
	let dimensions = {
		width: height,
		height: height,
		margin: {
			top: 100,
			right: 10,
			bottom: 50,
			left: 50,
		},
	};
	dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
	dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left;

	// Draw Canvas
	
	const entireChart = d3.select("main")
		.append("svg")
			.attr("width", dimensions.width)
			.attr("height", dimensions.height);

	const graph = entireChart.append("g")
		.style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

	// Create scales
	
	const xScale = d3.scaleTime()
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth]);

	const yScale = d3.scaleTime()
		.domain(d3.extent(dataset, yAccessor))
		.range([dimensions.boundedHeight, 0]);

	// Draw data
	
	const dots = graph.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", d => xScale(xAccessor(d)))
		.attr("cy", d => yScale(yAccessor(d)))
		.attr("r", 5)
		.attr("class", "dot")
		.attr("data-xvalue", d => xAccessor(d))
		.attr("data-yvalue", d => yAccessor(d))
		.attr("fill", d => {
			return dopeAccessor(d) === "" ? "cornflowerblue" : "firebrick";
		})
		.attr("stroke", "black")
		.attr("stroke-width", 1);


	// Draw peripherals

	const xAxisGenerator = d3.axisBottom()
		.scale(xScale);

	const xAxis = graph.append("g")
		.call(xAxisGenerator)
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)
		.attr("id", "x-axis");

	const yAxisGenerator = d3.axisLeft()
		.scale(yScale)
		.tickFormat(d3.timeFormat("%M:%S"));

	const yAxis = graph.append("g")
		.call(yAxisGenerator)
		.attr("id", "y-axis");

	const legendText = entireChart.append("g")
		.attr("id", "legend")
		.style("transform", `translate(${dimensions.width * 0.9}px, ${dimensions.height * 0.5}px)`);

	const noDopeText = legendText.append("text")
		.text("No doping allegations")
		.style("text-anchor", "end");

	const dopeAllegations = legendText.append("text")
		.text("Riders with doping allegations")
		.attr("y", 25)
		.style("text-anchor", "end");

	const dopeRects = entireChart.append("g")
		.style("transform", `translate(${dimensions.width * 0.91}px, ${dimensions.height * 0.5}px`);

	const noDopeRect = dopeRects.append("rect")
		.attr("width", 20)
		.attr("height", 20)
		.attr("y", -15)
		.attr("fill", "cornflowerblue")

	const dopingRect = dopeRects.append("rect")
		.attr("width", 20)
		.attr("height", 20)
		.attr("y", 10)
		.attr("fill", "firebrick")

	const titleGroup = entireChart.append("g")
		.style("transform", `translate(${dimensions.width * 0.5}px, ${dimensions.margin.top * 0.35}px)`)
		.attr("id", "title");

	const title = titleGroup.append("text")
		.attr("id", "h1-title")
		.html("Doping in Professional Bicycle Racing")
		.attr("text-anchor", "middle");

	const subTitle = titleGroup.append("text")
		.attr("id", "h2-title")
		.attr("y", 20)
		.html("35 Fastest times up Alpe d'Huez")
		.style("text-anchor", "middle");
}

scatterPlot();
