const express = require('express');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: "Success..."
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
        errorMessage: "Could not retrieve action by id..."
      })
    })
})

router.post('/', (req, res) => {
    Actions.get()
      .then(() => {
        if (!req.body.project_id || !req.body.description) {
          res.status(400).json({
            errorMessage: "Missing id or description..."
          })
        } else {
          Actions.insert(req.body)
            .then(action => {
              res.status(200).json(action)
            })
            .catch(err => {
              console.log("Error: ", err);
              res.status(500).json({
                errorMessage: "Could not add..."
              })
            })
        }
      })
      .catch(err => {
        console.log("Error: ", err);
        res.status(500).json({
          errorMessage: "Could not connect..."
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
        errorMessage: "Could not update..."
      })
    })
})

router.delete('/:id', validateId(), (req, res) => {
  Actions.remove(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "Successfully removed..."
      })
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({
        errorMessage: "Could not remove..."
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
            errorMessage: "Invalid id..."
          })
        }
      })
      .catch(err => {
        console.log("Error: ", err);
        res.status(500).json({
          errorMessage: "Could not connect..."
        })
      })
  }
}

module.exports = router;