var width = 960;
var height = 570;
var padding = 60;

const margin = {top: 25, right: 5, bottom: 15, left: 5}
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
    color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
    format = d3.format("s");

var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([innerWidth, innerHeight])
    .paddingInner(1);




d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json", function(error, data) {
  if (error) throw error;

  var root = d3.hierarchy(data)
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum(sumBySize)
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  treemap(root);

  var cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

const toolTipContent = function(d) {			
  document.getElementById("tooltip").setAttribute("data-value", d.data.value ); 
  const tooltipText = 
  "Name: " + d.data.name + "<br/>" +
  "Platform: " + d.data.category + "<br/>"  +
  d.data.value + " million copies sold"

  return tooltipText
  };  

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .attr('id', 'tooltip')
  .html( (d) => toolTipContent(d) )

svg.call(tip)  

      

  cell.append("rect")
      .attr("class", "tile")
      .attr("id", function(d) { 
        
        // console.log(d)
        
        return d.data.id; })
      .attr("data-name", function(d) { return d.data.name; })
      .attr("data-category", function(d) { return d.data.category; })
      .attr("data-value", function(d) { return +d.data.value; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) { return color(d.data.category); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  // cell.append("clipPath")
  //     .attr("id", function(d) { return "clip-" + d.data.id; })
  //   .append("use")
  //     .attr("xlink:href", function(d) { return "#" + d.data.id; });

  cell.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .selectAll("tspan")
      .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; });

  cell.append("title")
      .text(function(d) { return d.data.id + "\n" + format(d.value); });

      const colorLegend = (selection, props) => {
        const { color, circleRadius, spacing, textOffset } = props;
        
        const groups = selection.selectAll('g')
          .data(color.domain());
        
          // d3.select('body')
          // .append('svg')

        const groupsEnter = groups
            .enter().append('g')
            .attr('class', 'tick')
            .attr('id', 'legend');
        
        groupsEnter
          .merge(groups)
          .attr('transform', (d, i) => `translate(${i * spacing}, 0)`);
          
          groups.exit().remove();
      
        // nested version of general update pattern
        groupsEnter
          .append('rect')
          .attr('id', 'legend')
          .merge(groups.select('rect'))
          .attr('class', 'legend-item')
          .attr('x', -22)
          .attr('y', -15)
          .attr('width', 40)
          .attr('height', 30)
          .attr('fill', color);
      
        groupsEnter
          .append('text')
          .merge(groups.select('text'))
          .text((d) => (d))
          .attr('dy', '0.32em')
          .attr('fill', '#8e88883')
          .attr('stroke', 'black')
          .attr('x', textOffset);
      };
      
       svg.append('g')	
          .attr('transform', `translate(${innerWidth/5},${innerHeight + 25})`)
          .call(colorLegend, {
            color,
            circleRadius: 15,
            spacing: 40,
            textOffset: -8
          });


  // d3.selectAll("input")
  //     .data([sumBySize, sumByCount], function(d) { return d ? d.name : this.value; })
  //     .on("change", changed);

//   var timeout = d3.timeout(function() {
//     d3.select("input[value=\"sumByCount\"]")
//         .property("checked", true)
//         .dispatch("change");
//   }, 2000);

//   function changed(sum) {
//     timeout.stop();

    // treemap(root.sum(sum));

//     cell.transition()
//         .duration(750)
//         .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
//       .select("rect")
//         .attr("width", function(d) { return d.x1 - d.x0; })
//         .attr("height", function(d) { return d.y1 - d.y0; });
//   }
});

function sumByCount(d) {
  return d.children ? 0 : 1;
}

function sumBySize(d) {
  return +d.value;
}