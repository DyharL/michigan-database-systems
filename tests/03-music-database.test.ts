import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MusicDatabase } from '../src/modules/03-music-database.js';

describe('Module 03: Relational Music Schema', () => {
  it('deduplicates normalized entities and executes multi-table JOINs', () => {
    const db = new MusicDatabase();

    db.insertTrack({
      title: 'Thunderstruck',
      artist: 'AC/DC',
      album: 'The Razors Edge',
      genre: 'Rock',
      durationMs: 292000,
      rating: 5
    });

    db.insertTrack({
      title: 'Moneytalks',
      artist: 'AC/DC',
      album: 'The Razors Edge',
      genre: 'Rock',
      durationMs: 225000,
      rating: 4
    });

    const catalog = db.queryCatalogWithJoins();
    assert.equal(catalog.length, 2);
    assert.equal(catalog[0].artistName, 'AC/DC');
    assert.equal(catalog[0].albumTitle, 'The Razors Edge');
    assert.equal(catalog[0].genreName, 'Rock');
    assert.equal(catalog[1].artistName, 'AC/DC');
  });
});
