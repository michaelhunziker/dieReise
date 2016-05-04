var express = require('express');
var Events = require('../models/events');
var eventRouter = express.Router();

eventRouter.route('/')
  .get(function (req, res, next) {
    Events.find({})
      .then(function (event) {
        res.json(event);
      })
      .catch(defaultErrorHandler.bind(null, next))
  })

  .post(function (req, res, next) {
    Events.create(req.body)
      .then(function (event) {
        // FIXME: Use winston
        console.log('Event created!');
        res.send(200, 'Added the event with id: ' + event._id);
      })
      .catch(defaultErrorHandler.bind(null, next))
  });

// .delete(function (req, res, next) {
//   Events.remove({})
//     .then(function (event) {
//       res.json(event);
//     })
//     .catch(function (err) {
//       next(err);
//     });
// });

eventRouter.route('/:eventId')
  .get(function (req, res, next) {
    Events.findById(req.params.eventId)
      .then(function (event) {
        res.json(event);
      })
      .catch(function (err) {
        res.sendResponse(404);
      });
  })

  .put(function (req, res, next) {
    Events.findByIdAndUpdate(req.params.eventId, {
        $set: req.body
      }, {
        new: true
      })
      .then(function (event) {
        res.json(event);
      })
      .catch(defaultErrorHandler.bind(null, next))
  });

// .delete(function (req, res, next) {
//   Events.findByIdAndRemove(req.params.eventId)
//     .then(function (event) {
//       res.json(event);
//     })
//     .catch(function (err) {
//       next(err);
//     });
// });

eventRouter.route('/:eventId/registration')
  .get(function (req, res, next) {
    Events.findById(req.params.eventId)
      .then(function (event) {
        res.json(event.registration);
      })
      .catch(defaultErrorHandler.bind(null, next))
  })

  .post(function (req, res, next) {

    Events.findById(req.params.eventId)
      .then(addRegistration)
      .then(saveEvent)
      .catch(defaultErrorHandler.bind(null, next));

    function addRegistration(event) {
      event.registration.push(req.body);
      return event;
    }

    function saveEvent(event) {
      return event.save();
    }

    function sendResponse(event) {
      // FIXME: Replace all console.logs with winston logger (e.g. winston.error('message'));
      console.log('Updated Registration!');
      res.json(event);
    }

  });

// .delete(function (req, res, next) {
//   Events.findById(req.params.eventId, function (err, event) {
//     if (err) next(err);
//     for (var i = (event.registration.length - 1); i >= 0; i--) {
//       event.registration.id(event.registration[i]._id).remove();
//     }
//     event.save(function (err, result) {
//       if (err) next(err);
//       res.writeHead(200, {
//         'Content-Type': 'text/plain'
//       });
//       res.end('Deleted all registrations!');
//     });
//   });
// });

eventRouter.route('/:eventId/registration/:registerId')
  .get(function (req, res, next) {
    Events.findById(req.params.eventId)
      .then(function () {
        res.json(event.registration.id(req.params.registerId));
      })
      .catch(defaultErrorHandler.bind(null, next))
  });

function defaultErrorHandler(err, next) {
  next(err);
}

// .put(function (req, res, next) {
//   // We delete the existing registration and insert the updated
//   // registration as a new registration
//   Events.findById(req.params.eventId, function (err, event) {
//     if (err) next(err);
//     event.registration.id(req.params.registerId).remove();
//     event.registration.push(req.body);
//     event.save(function (err, event) {
//       if (err) next(err);
//       console.log('Updated Registrations!');
//       res.json(event);
//     });
//   });
// })

// .delete(function (req, res, next) {
//   Events.findById(req.params.eventId, function (err, event) {
//     event.registration.id(req.params.registerId).remove();
//     event.save(function (err, resp) {
//       if (err) next(err);
//       res.json(resp);
//     });
//   });
// });


module.exports = eventRouter;
