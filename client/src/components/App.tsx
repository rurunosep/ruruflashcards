import { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import Navbar from './Navbar';
import ErrorAlert from './ErrorAlert';
import Quiz from './Quiz';
import Options from './Options';
import CardsList from './CardsList';
import RegisterModal from './RegisterModal';
import AddCardModal from './AddCardModal';
import EditCardModal from './EditCardModal';
import Footer from './Footer';
import { LoadingContext } from '../context';

export default function App() {
  const loadingStates = useContext(LoadingContext);

  const [username, setUsername] = useState<string | null>(null);
  const [cards, setCards] = useState([] as Card[]);
  const [ttsLanguage, setTtsLanguage] = useState('fr-FR');
  const [ttsVoiceName, setTtsVoiceName] = useState<string | null>(null);
  const [autoplayTts, setAutoplayTts] = useState(false);
  const [reverseQuiz, setReverseQuiz] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load options from local storage
  useEffect(() => {
    const options = JSON.parse(localStorage.getItem('options') || '{}');
    if (options) {
      setTtsLanguage(options.ttsLanguage);
      setTtsVoiceName(options.ttsVoiceName);
      setAutoplayTts(options.autoplayTts);
      setReverseQuiz(options.reverseQuiz);
    }
  }, []);

  // Save options to local storage
  useEffect(() => {
    localStorage.setItem(
      'options',
      JSON.stringify({
        ttsLanguage,
        ttsVoiceName,
        autoplayTts,
        reverseQuiz,
      }),
    );
  }, [ttsLanguage, ttsVoiceName, autoplayTts, reverseQuiz]);

  // Get username of the authenticated user of the current session
  useEffect(() => {
    loadingStates.login.setLoading(true);
    axios
      .get('api/auth/user')
      .then((res) => setUsername(res.data ? res.data : null))
      .finally(() => loadingStates.login.setLoading(false));
  }, []);

  // Load cards from api
  useEffect(() => {
    loadingStates.cards.setLoading(true);
    axios
      .post('/api/graphql', {
        query: `
          {
            cards {
              _id
              front
              back
            }
          }
        `,
      })
      .then((res) => setCards(res.data.data.cards || []))
      .finally(() => loadingStates.cards.setLoading(false));
  }, [username]);

  const addCard = useCallback((front: string, back: string) => {
    loadingStates.addCard.setLoading(true);
    axios
      .post('/api/graphql', {
        query: `
          mutation {
            add_card(front: "${front}", back: "${back}") {
              _id
            }  
          }
        `,
      })
      .then((res) => {
        setCards((cs) => [...cs, { _id: res.data.data.add_card._id, front, back }]);
      })
      .finally(() => loadingStates.addCard.setLoading(false));
  }, []);

  const editCard = useCallback((_id: string, changes: { front?: string; back?: string }) => {
    const front = changes.front || 'null';
    const back = changes.back || 'null';
    loadingStates.editDeleteCard.setCardIds((ids) => [...ids, _id]);
    axios
      .post('/api/graphql', {
        query: `
          mutation {
            edit_card(_id: "${_id}", front: "${front}", back: "${back}") {
              _id
            }
          }
      `,
      })
      .then(() => setCards((cs) => cs.map((c) => (c._id === _id ? { ...c, ...changes } : c))))
      .finally(() =>
        loadingStates.editDeleteCard.setCardIds((ids) => [...ids.filter((id) => id !== _id)]),
      );
  }, []);

  const deleteCard = useCallback((_id: string) => {
    loadingStates.editDeleteCard.setCardIds((ids) => [...ids, _id]);
    axios
      .post('/api/graphql', {
        query: `
        mutation {
          delete_card(_id: "${_id}") {
            _id
          }
        }
        `,
      })
      .then(() => setCards((cs) => [...cs.filter((c) => c._id !== _id)]))
      .finally(() =>
        loadingStates.editDeleteCard.setCardIds((ids) => [...ids.filter((id) => id !== _id)]),
      );
  }, []);

  const login = useCallback((username: string, password: string) => {
    loadingStates.login.setLoading(true);
    axios
      .post('api/auth/login', { username, password })
      .then(() => setUsername(username))
      .catch((err) => setErrorMessage(err.response.data))
      .finally(() => loadingStates.login.setLoading(false));
  }, []);

  const logout = useCallback(() => {
    loadingStates.login.setLoading(true);
    axios
      .get('api/auth/logout')
      .then(() => {
        setUsername(null);
        setCards([]);
      })
      .finally(() => loadingStates.login.setLoading(false));
  }, []);

  const register = useCallback((username: string, password: string) => {
    loadingStates.login.setLoading(true);
    axios
      .post('api/auth/register', { username, password })
      .then(() => {
        setUsername(username);
      })
      .catch((err) => {
        setErrorMessage(err.response.data);
      })
      .finally(() => loadingStates.login.setLoading(false));
  }, []);

  const cardsLoadingSpinner = (
    <div className="row flex-center">
      <div className="margin-large">
        <ClipLoader loading size="3em" />
      </div>
    </div>
  );

  const mainContent = (
    <div className="row flex-center margin-none">
      <div className="sm-col margin-small" style={{ width: '25rem' }}>
        <Quiz
          cards={cards}
          ttsLanguage={ttsLanguage}
          ttsVoiceName={ttsVoiceName}
          autoplayTts={autoplayTts}
          reverseQuiz={reverseQuiz}
        />
        <Options
          ttsLanguage={ttsLanguage}
          ttsVoiceName={ttsVoiceName}
          autoplayTts={autoplayTts}
          reverseQuiz={reverseQuiz}
          setTtsLanguage={setTtsLanguage}
          setTtsVoiceName={setTtsVoiceName}
          setAutoplayTts={setAutoplayTts}
          setReverseQuiz={setReverseQuiz}
        />
      </div>
      <div className="sm-col margin-small" style={{ width: '25rem' }}>
        <CardsList cards={cards} />
      </div>
    </div>
  );

  return (
    <>
      <Navbar username={username} login={login} logout={logout} />
      <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
      {username && (loadingStates.cards.loading ? cardsLoadingSpinner : mainContent)}
      <Footer />
      <RegisterModal register={register} setErrorMessage={setErrorMessage} />
      <AddCardModal addCard={addCard} />
      <EditCardModal editCard={editCard} deleteCard={deleteCard} />
    </>
  );
}
