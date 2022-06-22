const mysql = require('mysql');
const axios = require('axios');
const dbconfig = require('../dbconfig.json');
const util = require('util')

const db = wrapDB(dbconfig)

function wrapDB(dbconfig) {
  const pool = mysql.createPool(dbconfig)
  return {
    query(sql, args) {
      console.log("in query in wrapper")
      return util.promisify(pool.query)
        .call(pool, sql, args)
    },
    release() {
      return util.promisify(pool.releaseConnection)
        .call(pool)
    }
  }
}

exports.getCitiesInCountry = async (countrycode) => {
  let cities = [];
  try {
    const cityResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population/cities/filter', { "country": countrycode })
    for (let data of cityResponse.data.data) {
      cities.push(data)
    }
  } catch (e) {
    return new Error('Could not get cities')
  }
  return cities;
}

exports.getCities = async () => {
  let cities = []
  try {
    const cityResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/population/cities')
    for (let data of cityResponse.data.data) {
      cities.push(data)
    }
  } catch (e) {
    return new Error('Could not get cities')
  }
  return cities;
}

exports.addCity = async (newCity) => {
  let results = await db.query('INSERT INTO city SET ?', newCity)
  return results.insertId;
}