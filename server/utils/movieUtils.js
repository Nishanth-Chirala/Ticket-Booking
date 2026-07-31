export const buildMovieDocument = (payload) => {
  const genres = payload.genres
    .split(',')
    .map((genre) => genre.trim())
    .filter(Boolean)
    .map((name) => ({ name }));

  const castMembers = (payload.castMembers || []).map((member) => ({
    name: member.name,
    character_name: member.characterName,
    profile_path: member.image,
  }));

  return {
    title: payload.title,
    overview: payload.description,
    poster_path: payload.posterImage,
    backdrop_path: payload.bannerImage,
    release_date: payload.releaseDate,
    original_language: payload.language,
    genres,
    casts: castMembers,
    vote_average: Number(payload.rating || 0),
    runtime: Number(payload.duration || 0),
    status: payload.status || 'Coming Soon',
    director: payload.director,
    trailer_url: payload.trailerUrl,
  };
};
