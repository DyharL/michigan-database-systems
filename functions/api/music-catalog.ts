import { MusicDatabase } from '../_lib/modules/03-music-database.ts';

export const onRequest: PagesFunction = async () => {
  const musicDb = new MusicDatabase();
  musicDb.insertTrack({ title: 'Thunderstruck', artist: 'AC/DC', album: 'The Razors Edge', genre: 'Hard Rock', durationMs: 292000, rating: 5 });
  musicDb.insertTrack({ title: 'Moneytalks', artist: 'AC/DC', album: 'The Razors Edge', genre: 'Hard Rock', durationMs: 225000, rating: 4 });
  musicDb.insertTrack({ title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', genre: 'Grunge', durationMs: 301000, rating: 5 });
  return new Response(JSON.stringify(musicDb.queryCatalogWithJoins()), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
