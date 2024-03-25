import React, { useState, useEffect } from 'react';
import './App.css';

interface Item{
  id: number;
  model: string;
  price: number;
  available : boolean;
}



function App() {
  const [tablets, setTablets] = useState([]);
  const [newTablet, setNewTablet] = useState({
    model: '',
    price: 0,
    available: false
  });

  useEffect(() => {
    fetchTablets();
  }, []);

  async function fetchTablets() {
    await fetch('http://localhost:3000/tablets')
        .then(response => response.json())
        .then(data => setTablets(data))
        .catch(error => console.error('Error fetching data:', error));
  }

  async function handleInputChange(e: any) {
    const { name, checked, value } = e.target;
    const newValue = name === "available" ? checked : value;
    setNewTablet({
      ...newTablet,
      [name]: newValue
    });
  }

  async function handleSubmit(e : any){
    e.preventDefault();
    await fetch('http://localhost:3000/tablets', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newTablet)})
        .then(response => response.json())
        .then(() => {
          fetchTablets();
          setNewTablet({
            model: '',
            price: 0,
            available: false
          });
        })
        .catch(error => console.error('Error fetching data:', error));
  }

  async function handleDelete(id: number) {
    await fetch(`http://localhost:3000/tablets/${id}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newTablet)})
    .then(response => response.json())
    .then(() => {fetchTablets()})
    .catch(error => console.error('Error fetching data:', error));
  }

  return (
    <div className="App">
      <h1>Tabletek</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Model</th>
            <th>Ár</th>
            <th>Elérhető</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {tablets.map((tablet: Item, index) => (
            <tr key={index}>
              <td>{tablet.id}</td>
              <td>{tablet.model}</td>
              <td>{tablet.price}</td>
              <td>{tablet.available ? 'Igen' : 'Nem'}</td>
              <td><button className="delete" onClick={() => handleDelete(tablet.id)}>Törlés</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Új tablet felvétele</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>
          Model:
          <input type="text" name="model" value={newTablet.model} onChange={(e) => handleInputChange(e)} />
        </label>
        <label>
          Ár:
          <input type="number" name="price" value={newTablet.price} onChange={(e) => handleInputChange(e)} />
        </label>
        <label>
          Elérhető:
          <input id='checkbox' type="checkbox" name="available" checked={newTablet.available} onChange={(e) => handleInputChange(e)} />
        </label>
        <button className="submit" type="submit">Mentés</button>
      </form>
    </div>
  );
}

export default App;

