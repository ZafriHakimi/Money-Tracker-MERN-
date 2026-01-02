import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  const [transaction, setTransaction] = useState([])

  useEffect(() => {
    getTransacList()
  }, [transaction])

  const getTransacList = async () => {
    const url = import.meta.env.VITE_API_URL+'/transaction_list';
    const res = await fetch(url);
    const list = await res.json();
    setTransaction(list);
  };

  const addTransaction = (data) => {
    data.preventDefault()
    const url = import.meta.env.VITE_API_URL+'/transaction';
    const price = name.split(' ')[0]; //cuz price is at the front
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({ 
        price,
        name: name.substring(price.length+1), // take name start after price 
        desc,
        date 
      })
    }).then(res => {
      res.json().then(json => {
        //clear field after add
        setName('');
        setDate('');
        setDesc('');
        console.log('result', json); //test can connect backend or not
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

      {transaction.length > 0 && transaction.map(trans => (
        <div className="transaction" key={trans._id}>
          <div className="left">
            <div className="name">{trans.name}</div>
            <div className="description">{trans.desc}</div>
          </div>
          <div className="right">
            <div className="price red">{trans.price}</div>
            <div className="datetime">{trans.date}</div>
          </div>
        </div>
      ))}

    </main>
  )
}

export default App