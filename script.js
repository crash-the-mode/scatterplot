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
	const height = window.innerHeight * 0.9;
	const width = height;
	let dimensions = {
		width: height,
		height: height,
		margin: {
			top: 10,
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
		});


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
}

scatterPlot();
