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
  const [uploadingField, setUploadingField] = useState(null);

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

  const uploadImage = async (file, folder, fieldKey) => {
    if (!file) return;

    try {
      setUploadingField(fieldKey);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!data.success) {
        toast.error(data.message || 'Image upload failed');
        return null;
      }

      toast.success('Image uploaded');
      return data.url;
    } catch (error) {
      console.error('Image upload failed', error);
      toast.error('Unable to upload image right now');
      return null;
    } finally {
      setUploadingField(null);
    }
  };

  const handlePosterUpload = async (event) => {
    const url = await uploadImage(event.target.files?.[0], 'ticket-booking/posters', 'poster');
    if (url) updateField('posterImage', url);
    event.target.value = '';
  };

  const handleBannerUpload = async (event) => {
    const url = await uploadImage(event.target.files?.[0], 'ticket-booking/banners', 'banner');
    if (url) updateField('bannerImage', url);
    event.target.value = '';
  };

  const handleCastUpload = async (index, event) => {
    const url = await uploadImage(
      event.target.files?.[0],
      'ticket-booking/cast',
      `cast-${index}`
    );
    if (url) updateCastMember(index, 'image', url);
    event.target.value = '';
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
    <div>
      <Title text1="Add" text2="Movies" />

      <form onSubmit={handleSubmit} className="mt-8 max-w-4xl space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="font-medium text-zinc-200">Movie Title</span>
            <input
              required
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField('status', event.target.value)}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
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
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Genres</span>
            <input
              required
              value={form.genres}
              onChange={(event) => updateField('genres', event.target.value)}
              placeholder="Action, Drama"
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Language</span>
            <input
              required
              value={form.language}
              onChange={(event) => updateField('language', event.target.value)}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Release Date</span>
            <input
              required
              type="date"
              value={form.releaseDate}
              onChange={(event) => updateField('releaseDate', event.target.value)}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Duration (minutes)</span>
            <input
              required
              type="number"
              value={form.duration}
              onChange={(event) => updateField('duration', event.target.value)}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
            />
          </label>

          <div className="flex flex-col gap-2 text-sm">
            <span>Poster Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              disabled={uploadingField === 'poster'}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm"
            />
            
            {uploadingField === 'poster' && (
              <span className="text-xs text-gray-400">Uploading poster...</span>
            )}
            {form.posterImage && (
              <img
                src={form.posterImage}
                alt="Poster preview"
                className="mt-1 h-32 w-auto rounded object-cover"
              />
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span>Banner Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              disabled={uploadingField === 'banner'}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm"
            />
            {uploadingField === 'banner' && (
              <span className="text-xs text-gray-400">Uploading banner...</span>
            )}
            {form.bannerImage && (
              <img
                src={form.bannerImage}
                alt="Banner preview"
                className="mt-1 h-32 w-full rounded object-cover"
              />
            )}
          </div>

          <label className="flex flex-col gap-2 text-sm">
            <span>Trailer URL</span>
            <input
              value={form.trailerUrl}
              onChange={(event) => updateField('trailerUrl', event.target.value)}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
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
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Director</span>
            <input
              value={form.director}
              onChange={(event) => updateField('director', event.target.value)}
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-2/50 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Cast Members</h3>
            <button
              type="button"
              onClick={addCastMember}
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium transition hover:bg-primary-dull"
            >
              Add Cast
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {form.castMembers.map((member, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border border-white/10 bg-surface p-4 md:grid-cols-3"
              >
                <input
                  placeholder="Actor name"
                  value={member.name}
                  onChange={(event) => updateCastMember(index, 'name', event.target.value)}
                  className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
                />
                <input
                  placeholder="Character name"
                  value={member.characterName}
                  onChange={(event) =>
                    updateCastMember(index, 'characterName', event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50"
                />
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleCastUpload(index, event)}
                    disabled={uploadingField === `cast-${index}`}
                    className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm"
                  />
                  {uploadingField === `cast-${index}` && (
                    <span className="text-xs text-gray-400">Uploading cast image...</span>
                  )}
                  {member.image && (
                    <img
                      src={member.image}
                      alt={`${member.name || 'Cast'} preview`}
                      className="h-20 w-20 rounded object-cover"
                    />
                  )}
                </div>
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
          disabled={submitting || Boolean(uploadingField)}
          className="rounded-full bg-primary px-8 py-2.5 text-sm font-semibold transition hover:bg-primary-dull disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save Movie'}
        </button>
      </form>
    </div>
  );
};

export default AddMovies;
