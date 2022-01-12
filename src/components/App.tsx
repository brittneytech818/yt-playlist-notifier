import {useState, useEffect} from 'preact/hooks';

import {CurrentSubscriptions} from './CurrentSubscriptions';
import {LatestVideos} from './LatestVideos';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {SubscribedPlaylists, SetSubscribedPlaylists} from './context';
import {UPDATE_CHECK} from '../constants';

export function App() {
  const [subscribedPlaylists, setSubscribedPlaylists] = useState<Array<Value>>(
    [],
  );
  useEffect(() => {
    getSubscribedPlaylists().then((value) => setSubscribedPlaylists(value));
  }, []);

  const [controlled, setControlled] = useState<boolean>(false);
  useEffect(() => {
    if (navigator.serviceWorker.controller) {
      setControlled(true);
    } else {
      navigator.serviceWorker.addEventListener('controllerchange', () =>
        setControlled(true),
      );
    }
  }, []);

  const handleClick = async () => {
    navigator.serviceWorker.controller?.postMessage(UPDATE_CHECK);
  };

  return (
    <SetSubscribedPlaylists.Provider value={setSubscribedPlaylists}>
      <SubscribedPlaylists.Provider value={subscribedPlaylists}>
        <h2>YT Playlist Notifier</h2>
        <LatestVideos />
        <hr />
        <PlaylistSearchForm />
        <hr />
        <CurrentSubscriptions />
        <button
          id="check-now"
          disabled={controlled ? false : true}
          onClick={handleClick}
        >
          {controlled ? 'Check Now' : 'No SW Found'}
        </button>
      </SubscribedPlaylists.Provider>
    </SetSubscribedPlaylists.Provider>
  );
}
