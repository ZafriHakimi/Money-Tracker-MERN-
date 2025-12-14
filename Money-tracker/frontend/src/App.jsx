import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')

  const addTransaction = (data) => {
    data.preventDefault()
    const url = import.meta.env.VITE_API_URL+'/transaction';
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({ name, desc, date })
    }).then(res => {
      res.json().then( json => {
        console.log('result', json);
      })
    });
  };

  return (
    <main>
      <h1>RM500<span>.00</span></h1>
      <form onSubmit={addTransaction}>
        <div className='basic'>
          <input 
            type='text' 
            value={name} 
            placeholder=''
            onChange={e => setName(e.target.value)}
          />
          <input 
            type='datetime-local'
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className='description'>
          <input 
            type='text' 
            placeholder='description'
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>

      <div className="transaction">

        {/* Transaction 1 */}
        <div className="left">
          <div className="name">Samsung TV</div>
          <div className="description"></div>
        </div>
        <div className="right">
          <div className="price red">-RM500</div>
          <div className="datetime">2/12/2025 15:30</div>
        </div>

      </div>

      <div className="transaction">

        {/* Transaction 2 */}
        <div className="left">
          <div className="name">Bonus</div>
          <div className="description"></div>
        </div>
        <div className="right">
          <div className="price green">+RM500</div>
          <div className="datetime">2/12/2025 15:30</div>
        </div>

      </div>


    </main>
  )
}

export default App
