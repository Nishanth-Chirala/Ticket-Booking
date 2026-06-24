import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

 useEffect(() => {
  // 1. Only set the timer if nextUrl actually has a valid value
  if (!nextUrl) return;

  // 2. Save the timer reference
  const timer = setTimeout(() => {
    navigate('/' + nextUrl);
  }, 8000);

  // 3. CLEANUP: If the user leaves the page before 8 seconds, clear the timer
  return () => clearTimeout(timer);

}, [nextUrl, navigate]); // 4. Essential dependencies tell React to watch for changes


  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-14 w-14 border-2 border-t-primary"></div>
    </div>
  );
};
export default Loading;