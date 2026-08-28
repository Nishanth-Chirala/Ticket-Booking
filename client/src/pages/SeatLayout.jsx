import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRight, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const groupRows = [
    ['A', 'B'],
    ['C', 'D'],
    ['E', 'F'],
    ['G', 'H'],
    ['I', 'J'],
  ];

  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);

      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast('Please select a time first');
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast('You can only select up to 5 seats');
    }
    if (occupiedSeats.includes(seatId)) {
      return toast('This seat is already booked');
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="mt-2 flex gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 cursor-pointer rounded-md border text-[10px] font-medium transition ${
                isSelected
                  ? 'border-primary bg-primary text-white shadow-md shadow-primary/30'
                  : 'border-primary/40 text-zinc-300 hover:border-primary hover:bg-primary/15'
              } ${isOccupied ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats = async () => {
    try {
      if (!selectedTime || !selectedTime.showId) {
        return;
      }
      console.log(
        'Getting occupied seats for showId:',
        selectedTime.showId,
        'Type:',
        typeof selectedTime.showId
      );
      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime.showId}`
      );
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookTickets = async () => {
    try {
      if (!user) {
        return toast.error('Please Login to Proceed');
      }

      if (!selectedTime || !selectedSeats.length) {
        return toast.error('Please select a time and Seat');
      }

      console.log(
        'Sending showId to backend:',
        selectedTime.showId,
        'Type:',
        typeof selectedTime.showId
      );
      const { data } = await axios.post(
        '/api/booking/create',
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getShow();
  }, []);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  return show ? (
    <div className="flex flex-col gap-10 px-6 pt-28 pb-16 md:flex-row md:gap-12 md:px-16 md:pt-36 lg:px-40">
      <aside className="h-max w-full overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 py-8 md:sticky md:top-28 md:w-64">
        <p className="px-6 text-lg font-semibold">Available Timings</p>
        <p className="mt-1 px-6 text-xs text-zinc-400">Pick a showtime for {date}</p>

        <div className="mt-5 space-y-1">
          {show.dateTime[date].map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex w-full cursor-pointer items-center gap-2 px-6 py-2.5 transition md:w-max md:rounded-r-lg ${
                selectedTime?.time === item.time
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary/20'
              }`}
            >
              <ClockIcon className="size-4" />
              <p className="text-sm font-medium">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="relative flex flex-1 flex-col items-center">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />

        <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Select Your Seats
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          {selectedSeats.length}/5 seats selected
        </p>

        <img src={assets.screenImage} alt="screen" className="max-w-full" />
        <p className="mt-2 mb-8 text-xs tracking-[0.25em] text-zinc-500 uppercase">
          Screen Side
        </p>

        <div className="flex flex-col items-center text-xs text-zinc-300">
          <div className="mb-6 grid grid-cols-2 gap-8 md:grid-cols-1 md:gap-2">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-primary/40" /> Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-primary" /> Selected
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-primary/40 opacity-40" />{' '}
            Booked
          </span>
        </div>

        <button
          onClick={bookTickets}
          className="mt-12 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-12 py-3.5 text-sm font-semibold transition hover:bg-primary-dull active:scale-[0.98]"
        >
          Proceed To Checkout
          <ArrowRight strokeWidth={2.5} className="size-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
