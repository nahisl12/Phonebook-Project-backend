const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

morgan.token('id', (req) => {
  return req.id;
});

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

let persons = [
  {
    name: "Arto Hellas",
    num: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    num: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    num: "12-43-234345",
    id: 3
  },
  {
    name: "Phoenix",
    num: "075107538691",
    id: 6
  },
  {
    name: "Maya",
    num: "0934720923",
    id: 7
  },
  {
    name: "Gumshoe",
    num: "45872692436",
    id: 8
  }
]


app.get('/', (request, response) => {
  response.send('<h1>Hello</h1>');
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people</p> ${date}`);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

   if(person) {
     response.json(person);
   } else {
     response.status(404).end();
   }
});

// add person
app.post('/api/persons', (request, response) => {
  const body = request.body;

  const person = {
    name: body.name,
    num: body.num,
    id: Math.floor(Math.random() * 100000)
  }

  if(!body.name && !body.num) {
    response.send(400).json({
      error: 'fields must be filled out'
    });
  } else if(persons.find(person => person.name === body.name)) {
    response.send(400).json({
      error: 'this name already exists in the phonebook'
    })
  }

  persons = persons.concat(person);
  response.json(person);
});

// del requests
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(202).end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});