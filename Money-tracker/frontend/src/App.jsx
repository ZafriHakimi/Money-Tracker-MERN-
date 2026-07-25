import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [price, setPrice] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  const [transaction, setTransaction] = useState([])

  const getTransacList = async () => {
    const url = import.meta.env.VITE_API_URL+'/transaction_list';
    const res = await fetch(url);
    const list = await res.json();
    setTransaction(list);
  };

  const addTransaction = async (event) => {
    event.preventDefault();

    try {
      const url = `${import.meta.env.VITE_API_URL}/transaction`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price,
          desc,
          date,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const newTransaction = await res.json();

      setTransaction(current => [...current, newTransaction]);

      setPrice('');
      setDate('');
      setDesc('');
    } catch (error) {
      console.error('Unable to add transaction:', error);
    }
  };

  useEffect(() => {
    getTransacList();
  }, [])

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