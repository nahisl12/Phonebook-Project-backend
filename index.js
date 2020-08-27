require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('id', (req) => {
  return req.id;
});

app.use(express.static('build'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

app.get('/', (request, response) => {
  response.send('<h1>Hello</h1>');
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`<p>Phonebook has info for ${Person.length} people</p> ${date}`);
});

// Get data from db
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' });
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if(error.name === 'InternalServerError') {
    return response.status(500).json({ error: error.message });
  }
  next(error);
}

app.use(errorHandler);

// same but entered id only
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(persons => {
      if(persons) {
        response.json(persons);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
  // const id = Number(request.params.id);
  // const person = persons.find(person => person.id === id);

  //  if(person) {
  //    response.json(person);
  //  } else {
  //    response.status(404).end();
  //  }
});

// add person
app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    num: body.num,
  });

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedandFormattedPerson => {
      response.json(savedandFormattedPerson);
   })
   .catch(error => next(error));
});

//update user details
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    num: body.num
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

// del requests
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
  // const id = Number(request.params.id);
  // persons = persons.filter(person => person.id !== id);
  // response.status(202).end();
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});