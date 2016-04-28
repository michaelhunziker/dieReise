var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Events = require('../models/events');

var eventRouter = express.Router();
eventRouter.use(bodyParser.json());

eventRouter.route('/')
.get(function (req, res, next) {
    Events.find({}, function (err, event) {
        if (err) throw err;
        res.json(event);
    });
})

.post(function (req, res, next) {
    Events.create(req.body, function (err, event) {
        if (err) throw err;
        console.log('Event created!');
        var id = event._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the event with id: ' + id);
    });
})

.delete(function (req, res, next) {
    Events.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

eventRouter.route('/:eventId')
.get(function (req, res, next) {
    Events.findById(req.params.eventId, function (err, event) {
        if (err) throw err;
        res.json(event);
    });
})

.put(function (req, res, next) {
    Events.findByIdAndUpdate(req.params.eventId, {
        $set: req.body
    }, {
        new: true
    }, function (err, event) {
        if (err) throw err;
        res.json(event);
    });
})

.delete(function (req, res, next) {
    Events.findByIdAndRemove(req.params.eventId, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});

eventRouter.route('/:eventId/registration')
.get(function (req, res, next) {
    Events.findById(req.params.eventId, function (err, event) {
        if (err) throw err;
        res.json(event.registration);
    });
})

.post(function (req, res, next) {
    Events.findById(req.params.eventId, function (err, event) {
        if (err) throw err;
        event.registration.push(req.body);
        event.save(function (err, event) {
            if (err) throw err;
            console.log('Updated Registration!');
            res.json(event);
        });
    });
})

.delete(function (req, res, next) {
    Events.findById(req.params.eventId, function (err, event) {
        if (err) throw err;
        for (var i = (event.registration.length - 1); i >= 0; i--) {
            event.registration.id(event.registration[i]._id).remove();
        }
        event.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all registrations!');
        });
    });
});

eventRouter.route('/:eventId/registration/:registerId')
.get(function (req, res, next) {
    Events.findById(req.params.eventId, function (err, event) {
        if (err) throw err;
        res.json(event.registration.id(req.params.registerId));
    });
})

.put(function (req, res, next) {
    // We delete the existing registration and insert the updated
    // registration as a new registration
    Events.findById(req.params.eventId, function (err, event) {
        if (err) throw err;
        event.registration.id(req.params.registerId).remove();
        event.registration.push(req.body);
        event.save(function (err, event) {
            if (err) throw err;
            console.log('Updated Registrations!');
            res.json(event);
        });
    });
})

.delete(function (req, res, next) {
    Events.findById(req.params.eventId, function (err, event) {
        event.registration.id(req.params.registerId).remove();
        event.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});



module.exports = eventRouter;