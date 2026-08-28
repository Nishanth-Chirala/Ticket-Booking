import { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';

const AdminRequests = () => {
  const { axios, getToken, isOwner } = useAppContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get('/api/admin-requests?status=pending', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setRequests(data.requests);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      setActingId(id);
      const { data } = await axios.post(
        `/api/admin-requests/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setRequests((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Action failed');
    } finally {
      setActingId(null);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchRequests();
    }
  }, [isOwner]);

  if (!isOwner) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface-2 p-8 text-center">
        <p className="text-lg font-medium">Owners only</p>
        <p className="mt-2 text-sm text-zinc-400">
          Only owners can review admin access requests.
        </p>
      </div>
    );
  }

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Admin" text2="Requests" />

      <div className="mt-8 max-w-3xl space-y-4">
        {requests.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-surface-2 px-6 py-12 text-center">
            <p className="font-medium">No pending requests</p>
            <p className="mt-1 text-sm text-zinc-400">
              New requests from users will show up here.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request._id}
              className="rounded-xl border border-primary/20 bg-primary/10 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{request.user?.name}</p>
                  <p className="text-sm text-zinc-400">{request.user?.email}</p>
                  {request.message && (
                    <p className="mt-2 text-sm text-zinc-300">{request.message}</p>
                  )}
                  <p className="mt-2 text-xs text-zinc-500">
                    Requested {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={actingId === request._id}
                    onClick={() => handleAction(request._id, 'approve')}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold transition hover:bg-emerald-500 disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={actingId === request._id}
                    onClick={() => handleAction(request._id, 'reject')}
                    className="rounded-full border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminRequests;
