const mongoose = require('mongoose');

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
}

const password = process.argv[2];
const personName = process.argv[3];
const personNum = process.argv[4];

const url = `mongodb+srv://nahid:${password}@cluster0.uleih.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  num: String,
});

const Person = mongoose.model('Person', personSchema);

if(personName && personNum) {
  const person = new Person({
    name: personName,
    num: personNum
  });

  person.save().then(result => {
    console.log(`Added ${result.name} number ${result.num} to phonebook`);
    mongoose.connection.close();
})
}

if(!personName && !personNum) {
  console.log('empty params');
  Person.find({}).then(result => {
    result.forEach(person => console.log(`${person.name} ${person.num}`));
    mongoose.connection.close()
  })
}

