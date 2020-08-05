import {
  select,
  geoAlbersUsa,
  geoPath,
  zoom,
  json,
  event,
  scaleOrdinal,
  schemeSpectral,
  schemeGreens,
  schemeCategory10,
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData';
import { colorLegend } from './colorLegend';

var width = 900;
var height = 600;
var padding = 60;

const margin = {top: 50, right: 20, bottom: 35, left: 140}
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const svg = select('svg');

const projection = geoAlbersUsa();
const pathGenerator = geoPath();

const g = svg.append('g');

svg.call(
  zoom().on('zoom', () => {
    g.attr('transform', event.transform);
  })
);

loadAndProcessData().then((counties) => {
  var color = d3
    .scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
    .range(d3.schemeGreens[9]);

  json(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
  ).then((eduData) => {


    const toolTipContent = function(d) {			
      document.getElementById("tooltip").setAttribute("data-education", eduData.find((edu) => edu.fips === d.id).bachelorsOrHigher ); 
      const tooltipText = 
      
      eduData.find((edu) => edu.fips === d.id).area_name + " " + 
      eduData.find((edu) => edu.fips === d.id).state + " " + 
      eduData.find((edu) => edu.fips === d.id).bachelorsOrHigher + "% "

      return tooltipText
      };  
  
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .attr('id', 'tooltip')
      .html( (d) => toolTipContent(d) )
  
    svg.call(tip)  
    


    g.selectAll('path')
      .data(counties.features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('data-fips', d => d.id)
      .attr('data-education', d => eduData.find((edu) => edu.fips === d.id).bachelorsOrHigher)
      .attr('d', pathGenerator)
      .attr('fill', (d) =>
        color(eduData.find((edu) => edu.fips === d.id).bachelorsOrHigher)
      )
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      
      const colorLegend = (selection, props) => {
        const { color, circleRadius, spacing, textOffset } = props;
        
        const groups = selection.selectAll('g')
          .data(color.domain());
        
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
          .attr('x', -22)
          .attr('y', -15)
          .attr('width', 40)
          .attr('height', 30)
          .attr('fill', color);
      
        groupsEnter
          .append('text')
          .merge(groups.select('text'))
          .text((d) => Math.round(d))
          .attr('dy', '0.32em')
          .attr('fill', '#8e88883')
          .attr('stroke', 'black')
          .attr('x', textOffset);
      };
      
       svg.append('g')	
          .attr('transform', `translate(${innerWidth/3},${innerHeight + 60 })`)
          .call(colorLegend, {
            color,
            circleRadius: 15,
            spacing: 40,
            textOffset: -8
          });



          // console.log('are we even here?')


    // .attr('id', (d) => d.id)
    // .attr('fill', (d) => {
    //   var result = eduData.filter((obj) => {
    //     return obj.fips === d.id;
    //   });
    //   if (result[0]) {
    //     return color(result[0].bachelorsOrHigher);
    //   }
    //   //could not find a matching fips id in the data
    //   return color(0);
    // });
  });
});
