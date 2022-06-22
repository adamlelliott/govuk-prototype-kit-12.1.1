const mysql = require('mysql');
const axios = require('axios');
const dbconfig = require('../dbconfig_employee.json');
const util = require('util');

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

exports.getEmployees = async () => {
    let employees = []
    try {
      const employeeResponse = await axios.get('http://localhost:8080/api/getEmployees')
      console.log(employeeResponse.data)
      for (let data of employeeResponse.data) {
        employees.push(data)
      }
    } catch (e) {
        console.log(e)
      return new Error('Could not get employees')
    }
    return employees;
  }