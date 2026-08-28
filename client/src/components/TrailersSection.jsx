import { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import BlurCircle from './BlurCircle';
import ReactPlayer from 'react-player';
import { PlayCircleIcon } from 'lucide-react';

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <section className="overflow-hidden px-6 py-16 md:px-16 md:py-20 lg:px-24 xl:px-44">
      <div className="mx-auto max-w-[960px]">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Watch
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Latest Trailers
        </h2>
      </div>

      <div className="relative mx-auto mt-8 max-w-[960px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
        <BlurCircle top="-100px" right="-100px" />
        <div className="relative aspect-video w-full">
          <ReactPlayer
            url={currentTrailer.videoUrl}
            controls={false}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      </div>

      <div className="group mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 md:gap-5">
        {dummyTrailers.map((trailer) => (
          <button
            key={trailer.image}
            type="button"
            className={`relative cursor-pointer overflow-hidden rounded-xl border transition duration-300 ${
              currentTrailer.image === trailer.image
                ? 'border-primary shadow-lg shadow-primary/20'
                : 'border-white/10 opacity-70 hover:opacity-100 hover:-translate-y-0.5 group-hover:opacity-50 hover:!opacity-100'
            }`}
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt="Trailer thumbnail"
              className="aspect-video h-full w-full object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow md:size-10"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default TrailersSection;
