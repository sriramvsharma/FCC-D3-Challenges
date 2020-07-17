const width = 900;
const height = 600;
const padding = 80;
const margin = {top: 10, right: 100, bottom: 35, left: 110}
const innerWidth = width - margin.left - margin.right; //You'll find a lot of these VA's (Value Accessors) in the code. VA's prevent repetitive code. 
const dataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
const xAxisLabel = 'Year'
const yAxisLabel = 'Time in Minutes)'

const render = data => {

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const tooltip = d3
  .select('.chart')
  .append('div')
  .attr('id', 'tooltip')
  .attr('class', 'tooltip')
  .style('opacity', 0);
  
  const svg = d3.select(".chart")
    .append("svg") // Adding an svg node to the chart div class. 
   .attr("viewBox", `0 0 ${width} ${height}`) // this makes the viz responsive. 

  const xScale = d3.scaleLinear() //Step 3: Use linear and band scales. 
  .domain([d3.min(data, d => d[4])-1, d3.max(data, d => d[4])+1])//input information
    .range([padding, width - padding]) //output information
 
  const yScale = d3.scaleTime() //Step 3: Use linear and band scales. 
    .domain([d3.max(data, d => d[0]),d3.min(data, d => (d[0]))])
    .range([height - padding, padding])
      
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('')) //Step 5: Add Axes
  const timeFormat = d3.timeFormat("%M:%S")
  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)

  
      svg.append("g")
        .attr("transform", `translate(${padding / 2}, ${height - padding})`)
        //^^ positioning an axis needs translate. When it's applied to the g element, 
        //it moves the whole group over and down by the given amounts

        .attr("id","x-axis")
        .call(xAxis) //Invokes the specified function exactly once, 
        //passing in this selection along with any optional arguments.
        // https://devdocs.io/d3~5/d3-selection#selection_call
      svg.append("g")
        .attr("transform", `translate(${(padding * 3)/2}, 0)`)
        .attr("id","y-axis")
        .call(yAxis);

      

      svg // add x-axis label to the viz.
        .append('g')
        .attr('transform', `translate(${width/2}, ${height - padding/2})`)
        .append('text')
        .attr('class', 'x-axis-label')
        // .append("text")
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
      .text(yAxisLabel);
 
const circles = svg.selectAll('circle') //Step 2: Create and place circles for each row in dataset. 
    .data(data);
  
    circles
      .enter().append('circle')
        .attr('class', 'dot')
        .attr("data-yvalue", (d) => d[0])
        .attr('data-xvalue', (d) => d[4])
        .attr('cy', d => yScale(d[0])) 
        .attr('cx', d => xScale(d[4]) + padding/2)
        .attr('r', 5)
        // .attr('fill', d => colorScaleScale(d[6]==='' ? 'yellow' : 'steelblue'))
        .style("fill", function(d) {
          return colorScale(d[6] != "");
        })
        .on('mouseover', (d, i) => {
      
//      Code below is tooltip related. 
      
            const formattedName = '<span>Name: ' + d[3]
            const formattedNationality = '<span>Country: ' + d[5]
            const formattedPlace = '<span>Place: ' + d[1]
            const formattedDoping = (d[6]==='') ? '' : '<span>Doping: ' + d[6]
            const formattedYear = '<span>Year: ' + d[4]
            const parseTime = d3.utcParse("%M:S")
            const formattedTime = '<span>Time: ' + timeFormat(d[0])
        
            tooltip
            .transition()
            .duration(0)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY}px`)
            .style('opacity', 0.8);

            tooltip
              .html(`<span>${formattedName}</span>
              <br><span>${formattedNationality}</span>
              <br><span>${formattedPlace}</span>
              <br><span>${formattedTime}</span>
              <br><span>${formattedDoping}</span>`)
              .attr('data-year', d[4]);
          })
          .on('mouseout', () => {
            tooltip
              .transition()
              .duration(200)
              .style('opacity', 0);
          });

  //Adding legend. 
    var legendBox = svg.append("g")
    .attr("id", "legend");
   
    var legend = legendBox.selectAll("#legend")
      .data(colorScale.domain())
      .enter().append("g")
      .attr("class", "legend-label")
      .attr("transform", function(d, i) {
        return "translate(0," + (height/2 - i * 20) + ")";
      });
  
    legend.append("circle")
      .attr("cx", width - 18)
      .attr("cy", ".32em")
      .attr("r", 8)
      .style("fill", colorScale);
  
    legend.append("text")
      .attr("x", width - 30)
      .attr("y", ".60em")
      .style("text-anchor", "end")
      .text( d => (d ? 'Riders with doping allegations' : 'No doping allegations') )

}

d3.json(dataURL) //Step 1: Get the json data. 
  .then(data => {
    var dataset = data.map(d => {
      var parsedTime = d.Time.split(':');
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      return [d.Time,d.Place, d.Seconds, d.Name, d.Year, d.Nationality, d.Doping, d.URL]
    }); 
  render(dataset)
})

