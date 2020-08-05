(function (d3$1, topojson) {
  'use strict';

  var loadAndProcessData = function () { return d3$1.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
      .then(function (topoJSONdata) {
        var counties = topojson.feature(topoJSONdata, topoJSONdata.objects.counties);
        return counties;
      }); };


  //Tried to convert this into a promise.all, and it failed. :( 


  // export const loadAndProcessData = () =>
  //   Promise.All([
  //     json(
  //       'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
  //     ),
  //     json(
  //       'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
  //     ),
  //   ])
  //   .then(([topoJSONdata]) => {
  //     console.log(topoJSONdata)
      
  //     // const counties = feature(topoJSONdata, topoJSONdata.objects.counties);
  //     // return counties;
      
  //     // console.log(topoJSONdata)
  //     // const counties = feature(topoJSONdata, topoJSONdata.objects.counties);
  //     // return counties;
  //   })

  var width = 900;
  var height = 600;

  var margin = {top: 50, right: 20, bottom: 35, left: 140};
  var innerWidth = width - margin.left - margin.right;
  var innerHeight = height - margin.top - margin.bottom;

  var svg = d3$1.select('svg');

  var projection = d3$1.geoAlbersUsa();
  var pathGenerator = d3$1.geoPath();

  var g = svg.append('g');

  svg.call(
    d3$1.zoom().on('zoom', function () {
      g.attr('transform', d3$1.event.transform);
    })
  );

  loadAndProcessData().then(function (counties) {
    var color = d3
      .scaleThreshold()
      .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
      .range(d3.schemeGreens[9]);

    d3$1.json(
      'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
    ).then(function (eduData) {


      var toolTipContent = function(d) {			
        document.getElementById("tooltip").setAttribute("data-education", eduData.find(function (edu) { return edu.fips === d.id; }).bachelorsOrHigher ); 
        var tooltipText = 
        
        eduData.find(function (edu) { return edu.fips === d.id; }).area_name + " " + 
        eduData.find(function (edu) { return edu.fips === d.id; }).state + " " + 
        eduData.find(function (edu) { return edu.fips === d.id; }).bachelorsOrHigher + "% ";

        return tooltipText
        };  
    
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('id', 'tooltip')
        .html( function (d) { return toolTipContent(d); } );
    
      svg.call(tip);  
      


      g.selectAll('path')
        .data(counties.features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', function (d) { return d.id; })
        .attr('data-education', function (d) { return eduData.find(function (edu) { return edu.fips === d.id; }).bachelorsOrHigher; })
        .attr('d', pathGenerator)
        .attr('fill', function (d) { return color(eduData.find(function (edu) { return edu.fips === d.id; }).bachelorsOrHigher); }
        )
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
        
        var colorLegend = function (selection, props) {
          var color = props.color;
          var circleRadius = props.circleRadius;
          var spacing = props.spacing;
          var textOffset = props.textOffset;
          
          var groups = selection.selectAll('g')
            .data(color.domain());
          
          var groupsEnter = groups
              .enter().append('g')
              .attr('class', 'tick')
              .attr('id', 'legend');
          
          groupsEnter
            .merge(groups)
            .attr('transform', function (d, i) { return ("translate(" + (i * spacing) + ", 0)"); });
            
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
            .text(function (d) { return Math.round(d); })
            .attr('dy', '0.32em')
            .attr('fill', '#8e88883')
            .attr('stroke', 'black')
            .attr('x', textOffset);
        };
        
         svg.append('g')	
            .attr('transform', ("translate(" + (innerWidth/3) + "," + (innerHeight + 60) + ")"))
            .call(colorLegend, {
              color: color,
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

}(d3, topojson));
//# sourceMappingURL=bundle.js.map
