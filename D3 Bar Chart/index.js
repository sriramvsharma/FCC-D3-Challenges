const width = document.body.clientWidth;
const height = document.body.clientHeight - document.body.clientHeight * 5/100;
const padding = 100;
const margin = {top: 10, right: 100, bottom: 85, left: 110}
const innerWidth = width - margin.left - margin.right; //You'll find a lot of these VA's (Value Accessors) in the code. VA's prevent repetitive code. 
const innerHeight = height - margin.left - margin.right; //You'll find a lot of these VA's (Value Accessors) in the code. VA's prevent repetitive code. 
const dataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
const xAxisLabel = 'Year'
const yAxisLabel = 'Billions $ (USD)'

const render = data => {
const tooltip = d3
  .select('.chart')
  .append('div')
  .attr('id', 'tooltip')
  .attr('class', 'tooltip')
  .style('opacity', 0);
  
  const svg = d3.select(".chart")
    .append("svg") // Adding an svg node to the chart div class. 
   .attr("viewBox", `0 0 ${width} ${height}`) // this makes the viz responsive.
  //  .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
   .attr('preserveAspectRatio','xMinYMin') 

  
  const xScale = d3.scaleTime() //Step 3: Use linear and band scales. 
    .domain([data[0][0], data[data.length - 1][0]])//input information
    .range([padding, width - padding]) //output information
 
  const yScale = d3.scaleLinear() //Step 3: Use linear and band scales. 
    .domain([0, d3.max(data, d => d[1])])
    .range([height - padding, padding])
      
  const xAxis = d3.axisBottom(xScale) //Step 5: Add Axes
  const yAxis = d3.axisLeft(yScale)
  
      svg.append("g")
        .attr("transform", `translate(${padding / 2}, ${height - padding})`)
        //^^ positioning an axis needs translate. When it's applied to the g element, 
        //it moves the whole group over and down by the given amounts

        .attr("id","x-axis")
        .call(xAxis) //Invokes the specified function exactly once, 
        //passing in this selection along with any optional arguments.
        // https://devdocs.io/d3~5/d3-selection#selection_call
      svg.append("g")
        .attr("transform", `translate(${(padding * 3)/2}, padding)`)
        .attr("id","y-axis")
        .call(yAxis);


      svg // add x-axis label to the viz.
        .append('g')
        .attr('transform', `translate(${padding / 2}, 0)`)
        .append('text')
        .attr('x', width / 2 - padding)
        .attr('y', height - padding / 2)
        .attr('class', 'x-axis-label')
        .text(xAxisLabel);
  
      svg // add y-axis label to the viz.
        .append('g') 

 // Below: apply a transform attribute to position
 //  the axis on the SVG canvas in the right place.
 //  Otherwise, the line would render along the border
 //  of SVG canvas and wouldn't be visible.

      .attr('transform', `translate(${padding/2},${height/2})`)         //positioning an axis needs translate. When it's applied to the g element, it moves the whole group over and down by the given amounts
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('GDP (Billion $ USD)');
 
const formatTime = d3.utcFormat("%Y-%m-%d"); //Will set data-date and tooltip with this on D[0]. 

const bars = svg.selectAll('rect') //Step 2: Create and place rectangles for each row in dataset. 
    .data(data);
  
    bars
      .enter().append('rect')
        .attr('class', 'bar')
        .attr("data-date", (d) => formatTime(d[0]))
        .attr('data-gdp', d => d[1])
        .attr('x', d => xScale(d[0]) + padding / 2) 
        .attr('y', d => yScale(d[1]))
        .attr('width', (width - padding * 5) / data.length)
        .attr('height', d => height - padding - yScale(d[1]))
        .on('mouseover', (d, i) => {
      
//       All the code below is tooltip related. 
      
            const formattedDate = formatTime(d[0]);
            const bilOrTril = d[1] < 1000 ? '$' + d[1] + ' billion' : '$' + Number(d[1]/1000).toFixed(2) + ' trillion' 
            tooltip
              .transition()
              .duration(0)
              .style('left', `${d3.event.pageX}px`)
              .style('top', `${d3.event.pageY}px`)
              .style('opacity', 0.8);

            tooltip
              .html(`<span>${formattedDate}</span><br><span>${bilOrTril}</span>`)
              .attr('data-date', formattedDate);
          })
          .on('mouseout', () => {
            tooltip
              .transition()
              .duration(200)
              .style('opacity', 0);
          });
  
  
  
}

d3.json(dataURL) //Step 1: Get the json data. 
  .then(data => {

    var dataset = data.data.map(d => {
      return [new Date(d[0]),d[1]]
    }); 
  render(dataset)
})

// window.addEventListener('resize', render);