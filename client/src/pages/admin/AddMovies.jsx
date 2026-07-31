import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/admin/Title';
import toast from 'react-hot-toast';

const initialForm = {
  title: '',
  description: '',
  genres: '',
  language: '',
  releaseDate: '',
  duration: '',
  posterImage: '',
  bannerImage: '',
  trailerUrl: '',
  rating: '',
  status: 'Coming Soon',
  director: '',
  castMembers: [{ name: '', characterName: '', image: '' }],
};

const AddMovies = () => {
  const { axios, getToken } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCastMember = (index, field, value) => {
    setForm((prev) => {
      const castMembers = [...prev.castMembers];
      castMembers[index] = { ...castMembers[index], [field]: value };
      return { ...prev, castMembers };
    });
  };

  const addCastMember = () => {
    setForm((prev) => ({
      ...prev,
      castMembers: [...prev.castMembers, { name: '', characterName: '', image: '' }],
    }));
  };

  const removeCastMember = (index) => {
    setForm((prev) => ({
      ...prev,
      castMembers: prev.castMembers.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        duration: Number(form.duration),
        rating: Number(form.rating),
        castMembers: form.castMembers.filter((member) => member.name),
      };

      const { data } = await axios.post('/api/movies', payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        setForm(initialForm);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Movie add failed', error);
      toast.error('Unable to save movie right now');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <Title text1="Add" text2="Movies" />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2 text-sm">
            <span>Movie Title</span>
            <input
              required
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField('status', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            >
              <option value="Now Playing">Now Playing</option>
              <option value="Coming Soon">Coming Soon</option>
              <option value="Archived">Archived</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm md:col-span-2">
            <span>Description</span>
            <textarea
              required
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows="3"
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Genres</span>
            <input
              required
              value={form.genres}
              onChange={(event) => updateField('genres', event.target.value)}
              placeholder="Action, Drama"
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Language</span>
            <input
              required
              value={form.language}
              onChange={(event) => updateField('language', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Release Date</span>
            <input
              required
              type="date"
              value={form.releaseDate}
              onChange={(event) => updateField('releaseDate', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Duration (minutes)</span>
            <input
              required
              type="number"
              value={form.duration}
              onChange={(event) => updateField('duration', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Poster Image URL</span>
            <input
              required
              value={form.posterImage}
              onChange={(event) => updateField('posterImage', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Banner Image URL</span>
            <input
              required
              value={form.bannerImage}
              onChange={(event) => updateField('bannerImage', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Trailer URL</span>
            <input
              value={form.trailerUrl}
              onChange={(event) => updateField('trailerUrl', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Rating</span>
            <input
              required
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(event) => updateField('rating', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Director</span>
            <input
              value={form.director}
              onChange={(event) => updateField('director', event.target.value)}
              className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
            />
          </label>
        </div>

        <div className="rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Cast Members</h3>
            <button
              type="button"
              onClick={addCastMember}
              className="rounded bg-primary px-3 py-1.5 text-sm"
            >
              Add Cast
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {form.castMembers.map((member, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-3 rounded border border-gray-700 p-3">
                <input
                  placeholder="Actor name"
                  value={member.name}
                  onChange={(event) => updateCastMember(index, 'name', event.target.value)}
                  className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
                />
                <input
                  placeholder="Character name"
                  value={member.characterName}
                  onChange={(event) => updateCastMember(index, 'characterName', event.target.value)}
                  className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
                />
                <input
                  placeholder="Profile image URL"
                  value={member.image}
                  onChange={(event) => updateCastMember(index, 'image', event.target.value)}
                  className="rounded-md border border-gray-600 bg-gray-950 px-3 py-2"
                />
                {form.castMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCastMember(index)}
                    className="md:col-span-3 text-left text-sm text-red-400"
                  >
                    Remove cast member
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-primary px-6 py-2 text-sm font-medium disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Movie'}
        </button>
      </form>
    </div>
  );
};

export default AddMovies;
