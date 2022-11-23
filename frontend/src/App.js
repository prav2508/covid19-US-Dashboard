import './App.css';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import moment from 'moment'
import NavBar from './components/navBar';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function App() {
const [numeric, setNumeric] = useState([])
const [datac,setDatac] = useState()
const [userKey,setUserKey] = useState('tot_cases')
const [maxRange,setMaxRange] = useState()


const _ = require('lodash')


useEffect(()=>{

  axios({
    url: 'http://localhost:4000/api',
    method: 'post',
    data: {
      query: `
      query{
        covidData{
          submission_date
          state
          tot_cases
          tot_death
          new_case
          new_death


        }
      }
        `
    }
  }).then((result) => {

    setDatac(processData(result.data.data.covidData))
    
  })

},[])


const processData = (covidData)=>{
 
  var stateData =  _.mapValues(_.groupBy(covidData, 'state'),
  clist => clist.map(val => _.omit(val, 'state')))


return stateData
}


  const processNumericData = (data,key)=>{
    var numeric = []
    _.mapValues(data,(o)=>{
      numeric.push(_.last(o)[key])
    })
    return numeric
  }

const handleChange = (e)=>{
setUserKey(e.target.value)
switch(e.target.value){
  case 'tot_cases':
    setMaxRange(7897831)
    break;
  case 'tot_death':
    setMaxRange(89409)
    break;
  case 'new_case':
    setMaxRange(15000)
    break;
  case 'new_death':
  setMaxRange(250)
  break;
}
}

const saveImage = ()=>{
  console.log(document.getElementsByClassName('main-svg'))
}

  return (
    <div className="App">

    <NavBar/>
<div style={{width: '50%', margin: '0 auto',padding:'50px'}}>


    <FormControl style={{width: '500px'}}>
  <InputLabel id="demo-simple-select-lab ">Parameter</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={userKey}
    label="Parameter"
    onChange={(e) => handleChange(e)}
  >
    <MenuItem value={'tot_cases'}>Total Cases</MenuItem>
    <MenuItem value={'tot_death'}>Total Deaths</MenuItem>
    <MenuItem value={'new_case'}>New Cases</MenuItem>
    <MenuItem value={'new_death'}>New Deaths</MenuItem>
  </Select>
</FormControl>

</div>
    <Plot
        data={[
          {
            type: 'choropleth',
            locationmode: 'USA-states',
            locations:_.keys(datac),
            z: processNumericData(datac,userKey),
            text:_.keys(datac),
            zauto: false,
            zmin: 0,
            zmax: maxRange,
            colorscale: [
              [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
              [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
              [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
          ],
          colorbar: {
            title: 'Millions USD',
            thickness: 20
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
            }
          }
        }
        ]}


        layout={{width: 1200, height: 700,
          geo:{
            scope: 'usa',
            countrycolor: 'rgb(255, 255, 255)',
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: 'rgb(255, 255, 255)',
            subunitcolor: 'rgb(255, 255, 255)',
            lonaxis: {},
            lataxis: {}
        }

      }}

      />
    

    </div>
  );
}

export default App;
