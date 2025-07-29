const { useState, useEffect, useRef } = React;

const allEmojis = [
  '🐶','🐱','🐭','🐹','🦊','🐻','🐼','🐨',
  '🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤'
];

const difficulties = {
  easy: 8,
  medium: 12,
  hard: 18
};

function shuffle(array) {
  return array
    .concat(array)
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({ id: index, value, flipped: false, matched: false }));
}

function createCards(count) {
  return shuffle(allEmojis.slice(0, count));
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

function getBestTime(level) {
  const stored = localStorage.getItem('bestTime_' + level);
  return stored ? parseInt(stored, 10) : null;
}

function MemoryGame() {
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState(createCards(difficulties['easy']));
  const [selected, setSelected] = useState([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(getBestTime('easy'));
  const timerRef = useRef(null);
  const flipAudio = useRef(new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'));
  const matchAudio = useRef(new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'));

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    setBestTime(getBestTime(difficulty));
  }, [difficulty]);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (first.value === second.value) {
        setCards(prev => prev.map(c => c.value === first.value ? { ...c, matched: true } : c));
        setMatches(m => m + 1);
        matchAudio.current.play();
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
    if (matches === difficulties[difficulty]) {
      clearInterval(timerRef.current);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('bestTime_' + difficulty, time);
      }
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
      flipAudio.current.play();
    }
  };

  const resetGame = (level = difficulty) => {
    setCards(createCards(difficulties[level]));
    setSelected([]);
    setMatches(0);
    setAttempts(0);
    setTime(0);
    startTimer();
    setDifficulty(level);
  };

  const handleLevelChange = e => {
    resetGame(e.target.value);
  };

  return (
    <div className="game-container">
      <div className="controls">
        <select value={difficulty} onChange={handleLevelChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={() => resetGame()}>Restart</button>
      </div>
      <div className="grid">
        {cards.map(card => <Card key={card.id} card={card} onFlip={flipCard} />)}
      </div>
      <p>Attempts: {attempts} | Matched: {matches}/{difficulties[difficulty]}</p>
      <p>Time: {time}s {bestTime !== null && `(Best: ${bestTime}s)`}</p>
      {matches === difficulties[difficulty] && <p>You win!</p>}
    </div>
  );
}

ReactDOM.render(<MemoryGame />, document.getElementById('root'));
