var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var bodyParser = require('body-parser')
const mysql = require('mysql');
const moment = require('moment');
const cors = require('cors');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'covid19'
})

const queryString = "WITH added_row_number AS ("
  +"SELECT"
   + "*,"
    +"ROW_NUMBER() OVER(PARTITION BY state ORDER BY submission_date DESC) as row_n "
  +"FROM covid19.t_covid_data) "
  +"SELECT"
    +"*"
  +"FROM added_row_number "
  +"WHERE row_n = 1"

  const getCovidDataQuery = "SELECT * FROM covid19.t_covid_data order by submission_date, state"

var covidData
const formatDate = (date)=>{
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
connection.connect()

connection.query(getCovidDataQuery, (err, rows, fields) => {
  if (err) throw err
  rows = rows.map(row => ({
    ...row,
    submission_date: formatDate(row.submission_date),
    created_date: formatDate(row.created_date)
  }));
  covidData = rows
})

var schema = buildSchema(`
    type CovidData{
      id: ID,
      submission_date: String!
      state: String!
      tot_cases: Int!
      conf_cases: Int!
      new_case: Int!
      prob_cases: Int!
      pnew_case: Int!
      tot_death: Int!
      conf_death: Int!
      prob_death: Int!
      new_death: Int!
      pnew_death: Int!
      created_at: String!
      consent_cases: String!
      consent_deaths: String!
    }

    type baseQuery {
      covidData : [CovidData!]!
    }

    type baseMutation {
      createCovidData(covidData: String): CovidData
    }

    schema {
      query: baseQuery
      mutation: baseMutation
    }

`)

var root = { 
  covidData : ()=>{
   
   return covidData
    },

    createCovidData : (args)=>{
      return []
    }
            };

var app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json())


connection.end()

app.use('/api', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/test',(req,res,next)=>{
res.send("Test Ok !!")
})
app.listen(4000, () => console.log('Backend server started!!'));