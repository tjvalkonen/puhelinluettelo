const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


let persons  = [
  { 
    name: "Arto Hellas", 
        number: "040-123456",
        id: "1"
  },
  { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: "2"
  },
  { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: "3"
  },
  { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: "4"
  }
]

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    let l = persons.length
    let date = new Date()
    response.send(`<p>Phonebook has info for ${l} people</p></p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if(!person.name){
    return response.status(400).json({ 
      error: 'Name missing!' 
    })
  } else if (!person.number)
  {
    return response.status(400).json({ 
      error: 'Number missing!' 
    })
  } else if (persons.find(p => p.name === person.name))  
  {
    return response.status(400).json({ 
      error: `${person.name} already exists! Name must be unique.` 
    })
  } else {
    const id = Math.floor(Math.random()*10000000)
    person.id = String(id)
    persons = persons.concat(person)
    // console.log(person)
    // console.log(JSON.stringify(person))
    response.json(person)
    // morgan.token('body', request => JSON.stringify(request.body))
  }
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})