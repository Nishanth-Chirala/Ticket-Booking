import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMovieDocument } from '../utils/movieUtils.js';

test('buildMovieDocument maps form data into backend-compatible movie fields', () => {
  const payload = {
    title: 'The New Horizon',
    description: 'A crew explores the stars.',
    genres: 'Sci-Fi, Adventure',
    language: 'English',
    releaseDate: '2026-08-15',
    duration: '142',
    posterImage: 'https://example.com/poster.jpg',
    bannerImage: 'https://example.com/banner.jpg',
    trailerUrl: 'https://example.com/trailer.mp4',
    rating: '8.4',
    status: 'Now Playing',
    director: 'Ava Chen',
    castMembers: [
      { name: 'Kai', characterName: 'Jules', image: 'https://example.com/kai.jpg' },
    ],
  };

  const doc = buildMovieDocument(payload);

  assert.equal(doc.title, 'The New Horizon');
  assert.equal(doc.overview, 'A crew explores the stars.');
  assert.equal(doc.poster_path, 'https://example.com/poster.jpg');
  assert.equal(doc.backdrop_path, 'https://example.com/banner.jpg');
  assert.equal(doc.release_date, '2026-08-15');
  assert.equal(doc.original_language, 'English');
  assert.equal(doc.vote_average, 8.4);
  assert.equal(doc.runtime, 142);
  assert.equal(doc.status, 'Now Playing');
  assert.equal(doc.director, 'Ava Chen');
  assert.equal(doc.genres[0].name, 'Sci-Fi');
  assert.equal(doc.genres[1].name, 'Adventure');
  assert.equal(doc.casts[0].name, 'Kai');
  assert.equal(doc.casts[0].character_name, 'Jules');
  assert.equal(doc.casts[0].profile_path, 'https://example.com/kai.jpg');
});
