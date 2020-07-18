/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, please read the README word for word, don't worry, you got this
in every task there may be trouble, but if you worry you make it double, don't worry, you got this
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, you got this
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just hack it…
I need this code, but don't know where, perhaps should make some middleware, don't worry, just hack it

Go code!
*/
//initial requirements
const express = require('express');
const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

// GET requests
router.get('/', (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      console.log('Errror: ', err);
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