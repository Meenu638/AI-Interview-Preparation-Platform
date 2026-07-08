import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash2, FiBookmark } from 'react-icons/fi';
import { bookmarkService } from '../services/misc.service';
import { Card, EmptyState, Skeleton } from '../components/ui/Shared';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await bookmarkService.list();
      setBookmarks(data.data.bookmarks);
      setLoading(false);
    };
    load();
  }, []);

  const handleRemove = async (id) => {
    await bookmarkService.remove(id);
    setBookmarks((prev) => prev.filter((b) => b._id !== id));
    toast.success('Bookmark removed.');
  };

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold flex items-center gap-2">
        <FiBookmark /> Bookmarked Questions
      </h1>

      {bookmarks.length === 0 ? (
        <EmptyState title="No bookmarks yet" description="Save tricky questions during interviews to review them later." />
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <Card key={b._id} className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase text-primary-400 font-semibold">{b.question?.topic}</span>
                <p className="font-medium mt-1">{b.question?.text}</p>
                {b.note && <p className="text-sm text-gray-400 mt-2 italic">Note: {b.note}</p>}
              </div>
              <button onClick={() => handleRemove(b._id)} className="text-gray-500 hover:text-rose-400 flex-shrink-0">
                <FiTrash2 />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
