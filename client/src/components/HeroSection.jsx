import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-start justify-center gap-4 pc-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} className="max-h-11 lg:h-11 mt-20" alt="" />
      <h1 className="text-5xl md:text-[70px] md:leadin-18 font-semibold max-w-110">
        Guardians <br /> of Galaxy
      </h1>

      <div className="flex items-center gap-4 text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className="size-4.5" /> 2018
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="size-4.5" /> 2h 8m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis enim
        reprehenderit iure, explicabo harum eum soluta illum, saepe atque maxime
        nostrum! Pariatur, fuga!
      </p>

      <button
        onClick={() => navigate('/movies')}
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
      >
        Explore Movies
        <ArrowRight className="size-5" />
      </button>
    </div>
  );
};
export default HeroSection;
