import { useState, useEffect } from 'react';
import axios from 'axios';

interface QuizProps {
  cards: Card[];
  ttsLanguage: string;
  ttsVoiceName: string | null;
  autoplayTts: boolean;
  reverseQuiz: boolean;
}

export default function Quiz({
  cards,
  ttsLanguage,
  ttsVoiceName,
  autoplayTts,
  reverseQuiz,
}: QuizProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [showNewCard, setShowNewCard] = useState(true);
  const [flipped, setFlipped] = useState(false);

  // Show new card
  useEffect(() => {
    if (showNewCard) {
      const newCard = cards[Math.floor(Math.random() * cards.length)];
      setCard(newCard);
      if (newCard) setShowNewCard(false);
    }
  }, [showNewCard, cards]);

  function playTTS() {
    if (!ttsLanguage || !ttsVoiceName || !card) return;
    axios
      .post(
        '/api/tts/synth',
        {
          text: (reverseQuiz ? !flipped : flipped) ? card.back : card.front,
          languageCode: ttsLanguage,
          voice: ttsVoiceName,
        },
        { responseType: 'blob' },
      )
      .then((res) => {
        const url = window.URL.createObjectURL(res.data);
        const audio = new Audio(url);
        audio.play();
      });
  }

  // Autoplay TTS when a new card appears
  useEffect(() => {
    if (card && autoplayTts) {
      playTTS();
    }
  }, [card]);

  return (
    <div className="card card-no-hover margin-bottom" style={{}}>
      <button
        type="button"
        className="btn-small margin-none"
        popover-top="Play TTS"
        style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}
        onClick={playTTS}
      >
        <i className="flaticon-sound-hand-drawn-interface-symbol" />
      </button>
      <button
        type="button"
        className="btn-small margin-none"
        popover-top="Flip Card"
        style={{ position: 'absolute', top: '0.5rem' }}
        onClick={() => setFlipped(!flipped)}
      >
        <i className="flaticon-cycle-couple-of-arrows-hand-drawn-lines" />
      </button>
      <button
        type="button"
        className="btn-small margin-none"
        popover-top="Random Card"
        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
        onClick={() => {
          setShowNewCard(true);
          setFlipped(false);
        }}
      >
        <i className="flaticon-arrow-pointing-to-right-hand-drawn-symbol" />
      </button>
      <div
        style={{
          display: 'flex',
          minHeight: '12rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '2.5rem' }}>
          {
            // It works. Don't worry about it...
            // eslint-disable-next-line no-nested-ternary
            card ? ((reverseQuiz ? !flipped : flipped) ? card.back : card.front) : ''
          }
        </span>
      </div>
    </div>
  );
}
