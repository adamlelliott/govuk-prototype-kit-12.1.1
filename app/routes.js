const express = require('express')
const router = express.Router()
const citydata = require('./citydata.js')
const employeedata = require('./employeedata')
const userdata = require('./userdata')


// Run this code when a form is submitted to 'juggling-balls-answer'
router.post('/talking-stick-usage-answer', function (req, res) {

  // Make a variable and give it the value from 'how-many-balls'
  var talkingStickType = req.session.data['talking-stick-type']

  // Check whether the variable matches a condition
  if (talkingStickType == "Discord Server") {
    // Send user to next page
    res.redirect('/talking-stick-details')
  } else {
    // Send user to ineligible page
    res.redirect('/ineligible')
  }

})

router.get('/list-employees', async (req, res) => {
  res.render('list-employees', { employees: await employeedata.getEmployees() })
});

router.get('/list-cities', async (req, res) => {
  res.render('list-cities', { cities: await citydata.getCities() })
});

router.get('/list-cities-in-country/:substr', async (req, res) => {
  res.render('list-cities',
    {
      cities: await citydata.getCitiesInCountry(req.params.substr.toLowerCase())
    });
})

router.post('/addcity', async (req, res) => {
  var city = req.body
  var countrycode = req.body.countrycode

  if (!countrycode.search(/^(GBR|IRL)$/)) {
    let insertedKey = await citydata.addCity(req.body)
    res.render('list-cities', { cities: await citydata.getCities() })
  } else {
    res.locals.errormessage = "Country code must be GBR or IRL"
    res.render('newcityform', req.body)
  }

})

router.post('/adduser', async (req, res) => {
  var user = req.body

  if (user) {
    let insertedKey = await userdata.addUser(req.body)
    res.render('list-users', { users: await userdata.getUsers() })
  } else {
    res.locals.errormessage = "No user specified!"
    res.render('newuserform', req.body)
  }
})

router.post('/verifyuser', async (req, res) => {
  var user = req.body

  if (user) {
    res.render('list-users', { users: await userdata.getUsers(), currentUser: await userdata.verifyUser(req.body) })
  } else {
    res.locals.errormessage = "No user specified!"
    res.render('newuserform', req.body)
  }
})

router.get('/list-users', async (req, res) => {
  res.render('list-users', { users: await userdata.getUsers() })
});

module.exports = router
