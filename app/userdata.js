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

exports.addUser = async (newUser) => {
  try {
    const usersResponse = await axios.post('http://localhost:8080/api/addUser', { "username": newUser.username, "password": newUser.password })
    return usersResponse
  } catch (e) {
    return new Error('Error creating user.')
  }
}

exports.verifyUser = async (user) => {
  try {
    const usersResponse = await axios.post('http://localhost:8080/api/verifyUser', { user: user })
    for (let data of usersResponse.data) {
      users.push(data)
    }
  } catch (e) {
    console.log(e)
    return new Error('Could not get users')
  }
  return users;
}

exports.getUsers = async () => {
  let users = []
  try {
    const usersResponse = await axios.get('http://localhost:8080/api/getUsers')
    for (let data of usersResponse.data) {
      users.push(data)
    }
  } catch (e) {
    console.log(e)
    return new Error('Could not get users')
  }
  return users;
}
