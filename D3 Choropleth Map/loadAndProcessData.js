import { feature } from 'topojson';
import { tsv, json } from 'd3';
export const loadAndProcessData = () =>
  json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
    .then((topoJSONdata) => {
      const counties = feature(topoJSONdata, topoJSONdata.objects.counties);
      return counties;
    });


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