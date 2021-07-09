//initial requirements
const express = require('express');
const Projects = require('../data/helpers/projectModel');

const router = express.Router();

// GET requests
router.get('/', (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      console.log('Error: ', err);
      res.status(500).json({
        errorMessage: "Could not retrieve projects"
      })
    })
})

router.get('/:id', validateId(), (req, res) => {
  res.status(200).json(req.project)
})

router.get('/:id/actions', validateId(), (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      console.log('Error: ', err);
      res.status(500).json({
        errorMessage: "Could not retrieve project actions"
      })
    })
})

//POST request - to insert new project
router.post('/', validateProject(), (req, res) => {
    Projects.insert(req.body)
      .then(project => {
        res.status(200).json(project)
      })
      .catch(err => {
        console.log('Error: ', err)
        res.status(500).json({
          errorMessage: "Could not create project"
        })
      })
  })

// PUT request - to update
router.put('/:id', validateId(), (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(project => {
      res.status(200).json(project)
    })
    .catch(err => {
      console.log('Error: ', err);
      res.status(500).json({
        errorMessage: "Could not update project, please ensure all fields are filled out"
      })
    })
})

// DELETE request - to remove project
router.delete('/:id', validateId(), (req, res) => {
  Projects.remove(req.params.id)
    .then(project => {
      res.status(200).json(project)
    })
    .catch(err => {
      console.log('Error: ', err);
      res.status(500).json({
        errorMessage: "Could not remove project"
      })
    })
})

// custom middleware
function validateId() {
  return (req, res, next) => {
    if (req.params.id) {
      Projects.get(req.params.id)
        .then(project => {
          if (project) {
            req.project = project
            next()
          } else {
            res.status(400).json({
              errorMessage: "Please provide a valid project id..."
            })
          }
        })
        .catch(err => {
          console.log("Error: ", err)
          res.status(500).json({
            errorMessage: "Error connecting to Project..."
          })
        })
    } else {
      res.status(400).json({
        errorMessage: "Please provide a valid porduct id..."
      })
    }
  }
}

function validateProject() {
  return (req, res, next) => {
    if (!req.body.name || !req.body.description) {
      res.status(400).json({
        errorMessage: "Please provide a name and description..."
      })
    } else {
      next();
    }
  }
}

module.exports = router;