const Pool = require('pg').Pool

const connection_name = process.env.INSTANCE_CONNECTION_NAME 

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: '/cloudsql/' + connection_name,
})

const radius = 700;

const getAllData = (request, response) => {

    var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) as features FROM (SELECT 'Feature' As type, ST_AsGeoJson(lg.location)::json As geometry, json_build_object( 'name', rasp_name, 'date', record_date, 'decibels', decibels) As properties FROM pi_noises As lg ) As f;"
    pool.query(querystring, (err, results) => {
  
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
             
            console.error('Database connection was closed.')
            response.status(500).json({"error": err.code });
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
            response.status(500).json({"error": err.code });

        }
        if (err.code === 'ECONNREFUSED') {
            console.log("Error" + err)
            console.error('Database connection was refused.')
            response.status(500).json({"error": err.code });

        }
        if (err) {
            console.log(err);
        }
    } else{

      response.status(200).json(results.rows[0])
    }
    })
  }

  const getObjectAtLatLng = (request, response) => {
    var lat = request.query.lat;
    var lng = request.query.lng;
    
    var latlongQuery = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) as features FROM (SELECT 'Feature' As type, ST_AsGeoJson(lg.location)::json As geometry, json_build_object( 'name', rasp_name, 'date', record_date, 'decibels', decibels) As properties FROM pi_noises As lg WHERE ST_DWithin(location, ST_MakePoint(" + lat + "," + lng + ")::geography, " + radius + ") ) As f;"

  
    pool.query(latlongQuery,(err, results) => {
      
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
             
            console.error('Database connection was closed.')
            response.status(500).json({"error": err.code });
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
            response.status(500).json({"error": err.code });

        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
            response.status(500).json({"error": err.code });

        }
        if (err) {
            console.log(err);
        }
    } else{

      response.status(200).json(results.rows[0])
    }

    })
  }


  module.exports = {
    getAllData,
    getObjectAtLatLng,
    
  }