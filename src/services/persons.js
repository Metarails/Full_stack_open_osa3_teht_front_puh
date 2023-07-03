import axios from "axios"
const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => {
      return response.data})
  }
  
  const create = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  }

const deletePerson = (person) => {
  const deleteUrl = `${baseUrl}/${person.id}`
  // console.log("delete: ", deleteUrl)
  if(window.confirm(`do you want to delete ${person.name} ${person.number}?`)){
    const request = axios.delete(deleteUrl)
    window.alert(`Deleted: ${person.name} ${person.number}`)
    return request
  }
  return false
}

const update = (newObject) => {
  const request = axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return request.then(response => response.data)
}


const methods = { getAll, create, deletePerson, update }
export default methods