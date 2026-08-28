import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate('/' + nextUrl);
      }, 8000);
    }
  }, []);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
      <p className="text-sm text-zinc-400">Loading...</p>
    </div>
  );
};

export default Loading;
