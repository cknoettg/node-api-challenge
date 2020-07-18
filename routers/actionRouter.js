const express = require('express');
const Actions = require('../data/helpers/actionModel');
const Projects = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: "No actions can be provided without a project_id"
  })
})

router.get('/:id', validateId(), (req, res) => {
  Actions.get(req.params.id)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(err => {
      console.log('Error: ', err);
      res.status(500).json({
        errorMessage: "Could not retrieve action with this id"
      })
    })
})

router.post('/', (req, res) => {
    Actions.get()
      .then(() => {
        if (!req.body.project_id || !req.body.description) {
          res.status(400).json({
            errorMessage: "Missing a required field"
          })
        } else {
          Actions.insert(req.body)
            .then(action => {
              res.status(200).json(action)
            })
            .catch(err => {
              console.log("Error: ", err);
              res.status(500).json({
                errorMessage: "Could not add action"
              })
            })
        }
      })
      .catch(err => {
        console.log("Error: ", err);
        res.status(500).json({
          errorMessage: "Something went wrong, rip"
        })
      })
  })

router.put('/:id', validateId(), (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(updatedAction => {
      res.status(200).json(updatedAction)
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({
        errorMessage: "Could not update action"
      })
    })
})

router.delete('/:id', validateId(), (req, res) => {
  Actions.remove(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "action removed from database"
      })
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({
        errorMessage: "Could not remove action"
      })
    })
})

function validateId() {
  return (req, res, next) => {
    Actions.get(req.params.id)
      .then(action => {
        if (action) {
          req.action = action
          next();
        } else {
          res.status(400).json({
            errorMessage: "Invalid id"
          })
        }
      })
      .catch(err => {
        console.log("Error: ", err);
        res.status(500).json({
          errorMessage: "Problem retrieving action"
        })
      })
  }
}

module.exports = router;