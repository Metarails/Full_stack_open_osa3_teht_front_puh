import { useState , useEffect } from 'react'
import peopleServices from "./services/persons"

const Notification = ({ message }) => {
  if (message === null || message === "" ) {
    return null
  }

  return (
    <div className="noticeMessage">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null || message === "" ) {
    return null
  }

  return (
    <div className="errorMessage">
      {message}
    </div>
  )
}

const PersonList = ({persons, filterEntry, delPerson }) => {

  const filterPersons = (person) => {
    if (person.name.toLowerCase().includes(filterEntry.toLowerCase())){
      return true
    }
    return(
      person.number.toLowerCase().includes(filterEntry.toLowerCase())
    )
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterEntry.toLowerCase()));
  const filteredPersons2 = persons.filter(filterPersons);

  return(
    <>
      <div>
        {persons.map(person => 
            <Person key={person.name} person={person} delPerson={delPerson} />
          )}
      </div>
      <h2>Filtered Numbers with name only</h2>
      <div>
        {filteredPersons.map(person => 
            <Person key={person.name} person={person} delPerson={delPerson} />
          )}
      </div>
      <h2>Filtered Numbers with numbers too</h2>
      <div>
        {filteredPersons2.map(person => 
            <Person key={person.name} person={person} delPerson={delPerson} />
          )}
      </div>
    </>
  )
}

const Person = ({ person, delPerson }) => {
  
  return (
    <p>{person.name} {person.number} <button onClick={() => delPerson(person)}>delete</button> </p>
  )
}

const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, addName }) => {
  

  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      {/* <div>debug name: {newName} Number: {newNumber}</div>
      <div>debug filter: {filterEntry}</div> */}
      <div>
        <button type="submit">add</button>
      </div>
    </form>
)
}

const Filter = ({filterEntry,handleFilterChange}) => {
  return (
    <div>
      filter shown: <input value={filterEntry} onChange={handleFilterChange} />
    </div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterEntry, setFilterEntry] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {

    peopleServices
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
      })
      .catch(error => {
        setErrorMessage(`somethign went wrong fetching data`);
        setTimeout(() => {
          setErrorMessage(null)
        }, 15000)
      })
  },[])

  const handleNameChange = (event) => {
    // console.log(event.target.value);
    setNewName(event.target.value);
  }
  const handleNumberChange = (event) => {
    // console.log(event.target.value);
    setNewNumber(event.target.value);
  }
  const handleFilterChange = (event) => {
    // console.log(event.target.value);
    setFilterEntry(event.target.value);
  }

  const  addName = (event) => {
    event.preventDefault();
    // console.log("button clicked", event.target, "new name: ", newName)

    const findPersonTest = persons.find( person => newName === person.name)
    // console.log("includes test: ",  findPersonTest);
    if (findPersonTest !== undefined) {
      // console.log("LÖYTY!!!")
      // alert(`${newName} is already added to phonebook`)
      if (window.confirm(`${newName} is already added to phonebook. Do you want to update the phonenumber to: ${newNumber}?`)){
        alert(`lets update number ${newNumber}`);
        // console.log("number: ", newNumber);

        // console.log("orignal person data: ", findPersonTest);
        const changedPerson = {...findPersonTest, number: newNumber};
        // console.log("changed person: ", changedPerson);
        
        // console.log(persons.map(person => person.id !== findPersonTest.id ? person : changedPerson));

        peopleServices
          .update(changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== findPersonTest.id ? person : returnedPerson));
            setMessage(`Changed persons: ${findPersonTest.name} phonenumber to: ${newNumber}`);
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Person ${findPersonTest.name} has already been deleted`);
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      
    }
    else {
      const nameObject = {
        name: newName,
        number: newNumber,
      }

      peopleServices
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          setMessage(`Added entry: ${newName}`);
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(`something went wrong creating new entry`);
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }

  }

  const delPerson = (person) => {
    // console.log("person:", person)
    const delRequest = peopleServices.deletePerson(person);
    if (delRequest){
      delRequest
        .then( () => {   
          setMessage(`successfully deleted: ${person.name}`);
          setTimeout(() => {
            setMessage(null)
          }, 5000);
          peopleServices
          .getAll()
          .then(reGetPeople => {
            setPersons(reGetPeople);
          })
        })
        .catch(error => {
          setErrorMessage(`Person ${person.name} has already been deleted`);
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
      <Filter filterEntry={filterEntry} handleFilterChange={handleFilterChange} />
      <h3>Add new</h3>      
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}      
      />
      <h3>Numbers</h3>
      <PersonList persons={persons} filterEntry={filterEntry} delPerson={delPerson} />
    </div>
  )

}

export default App