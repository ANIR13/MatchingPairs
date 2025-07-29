const { useState, useEffect, useRef } = React;

const emojis = ['🐶','🐱','🐭','🐹','🦊','🐻','🐼','🐨'];

function shuffle(array) {
  return array
    .concat(array)
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({ id: index, value, flipped: false, matched: false }));
}

function Card({ card, onFlip }) {
  const handleClick = () => {
    if (!card.flipped && !card.matched) onFlip(card);
  };
  return (
    <div className={`card ${card.flipped || card.matched ? 'flipped' : ''}`} onClick={handleClick}>
      {card.flipped || card.matched ? card.value : ''}
    </div>
  );
}

function MemoryGame() {
  const [cards, setCards] = useState(shuffle(emojis));
  const [selected, setSelected] = useState([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (first.value === second.value) {
        setCards(prev => prev.map(c => c.value === first.value ? { ...c, matched: true } : c));
        setMatches(m => m + 1);
        setSelected([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 1000);
      }
      setAttempts(a => a + 1);
    }
  }, [selected]);

  useEffect(() => {
    if (matches === emojis.length) {
      clearInterval(timerRef.current);
      if (!bestTime || time < bestTime) setBestTime(time);
    }
  }, [matches]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  };

  const flipCard = card => {
    if (selected.length < 2) {
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c));
      setSelected(sel => [...sel, card]);
    }
  };

  const resetGame = () => {
    setCards(shuffle(emojis));
    setSelected([]);
    setMatches(0);
    setAttempts(0);
    setTime(0);
    startTimer();
  };

  return (
    <div className="game-container">
      <div className="grid">
        {cards.map(card => <Card key={card.id} card={card} onFlip={flipCard} />)}
      </div>
      <p>Attempts: {attempts} | Matched: {matches}/{emojis.length}</p>
      <p>Time: {time}s {bestTime !== null && `(Best: ${bestTime}s)`}</p>
      {matches === emojis.length && <p>You win!</p>}
      <button onClick={resetGame}>Restart</button>
    </div>
  );
}

ReactDOM.render(<MemoryGame />, document.getElementById('root'));
