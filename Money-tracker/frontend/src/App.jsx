import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [price, setPrice] = useState('')
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
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({ 
        price,
        desc,
        date 
      })
    }).then(res => {
      res.json().then(json => {
        //clear field after add
        setPrice('');
        setDate('');
        setDesc('');
        console.log('result', json); //test can connect backend or not
      })
    });
  };

  const balance = transaction.reduce((total, trans) => {
    return total += trans.price;
  }, 0); //reduce has initialvalue & return 1 value, so no map

  const formattedDate = stringDate => {
    const date = new Date(stringDate);
    return date.toLocaleString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <main>
      <h1>RM {balance == 0 ? '0' : balance}<span></span></h1>
      <form onSubmit={addTransaction}>
        <div className='basic'>
          <input 
            type='number' 
            value={price} 
            placeholder='income/expense'
            onChange={e => setPrice(e.target.value)}
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
            <div className="name">{trans.desc}</div>
          </div>
          <div className="right">
            <div className={trans.price < 0 ? "price red" : 'price green'}>RM {trans.price}</div>
            <div className="datetime">{formattedDate(trans.date)}</div>
          </div>
        </div>
      ))}

    </main>
  )
}

export default App