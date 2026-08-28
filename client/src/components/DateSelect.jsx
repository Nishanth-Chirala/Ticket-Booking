import { useState } from 'react';
import BlurCircle from './BlurCircle';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DateSelect = ({ dateTime, id }) => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const onBookHandler = () => {
    if (!selected) {
      return toast('Please Select a Date');
    }
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  return (
    <div id="dateSelect" className="pt-16 md:pt-24">
      <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 p-6 md:flex-row md:gap-10 md:p-8">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        <div className="w-full">
          <p className="text-lg font-semibold">Choose Date</p>
          <p className="mt-1 text-sm text-zinc-400">
            Select a show date to continue booking
          </p>

          <div className="mt-6 flex items-center gap-4 text-sm md:gap-6">
            <ChevronLeftIcon width={24} className="shrink-0 text-zinc-400" />

            <span className="grid grid-cols-3 flex-wrap gap-3 md:flex md:max-w-lg md:gap-4">
              {Object.keys(dateTime).map((date) => (
                <button
                  onClick={() => setSelected(date)}
                  key={date}
                  className={`flex aspect-square h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-xl transition ${
                    selected === date
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'border border-primary/40 hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  <span className="text-base font-semibold">
                    {new Date(date).getDate()}
                  </span>
                  <span className="text-[11px] uppercase opacity-80">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                    })}
                  </span>
                </button>
              ))}
            </span>
            <ChevronRightIcon width={24} className="shrink-0 text-zinc-400" />
          </div>
        </div>

        <button
          onClick={onBookHandler}
          className="w-full cursor-pointer rounded-full bg-primary px-10 py-3 text-sm font-semibold transition hover:bg-primary-dull md:w-auto"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
