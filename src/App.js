import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useTransition } from 'react';
import useInterval from './hooks/useInterval';

function App() {
  const [list, setList] = useState(['A', 'B', 'C', 'D', 'E']);
  const [criteria, setCriteria] = useState("");
  const [bands, setBands] = useState([]);
  const [isPending, startTransition] = useTransition();

  useInterval(() => {
    if (bands.length > 0) {
      startTransition(() => {
        setList([...list.slice(1, 5), bands[bands.length - 1]]);
      });
      setBands([...bands].slice(0, 4));
    } else {
      startTransition(() => {
        setList([...list.slice(1, 5), list[0]]);
      });
    }
  }, 1000);

  useEffect(() => {
    async function gettingBandData() {
      try {
        let response = await fetch(`https://itunes.apple.com/search?term=${criteria}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        setBands(data.results.map(r => r.collectionName)?.sort().slice(0, 5));
      } catch (error) {
        console.log(error);
      }
    }

    criteria?.length > 3 && gettingBandData();

    if (!criteria) {
      setList(['A', 'B', 'C', 'D', 'E']);
      setBands([]);
    }
  }, [criteria]);

  const filter = (event) => {
    setCriteria(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <article>
        <section className='container'>
          <input type="text" placeholder='Search band' onChange={filter} />

          <ul>
            {list.map((element, index) => <li key={index}>{element}</li>)}
          </ul>
        </section>
      </article>
    </div>
  );
}

export default App;
