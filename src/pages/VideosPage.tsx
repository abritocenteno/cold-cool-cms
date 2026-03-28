import { useState } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Plus, X, Search, Video as VideoIcon, Youtube, Loader2, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VideosPage = () => {
  const videos = (useQuery(api.videos.list) as any[]) || [];
  const addVideo = useMutation(api.videos.add);
  const updateVideo = useMutation(api.videos.update);
  const removeVideo = useMutation(api.videos.remove);
  const fetchMetadata = useAction(api.videos.fetchMetadata);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [deletingVideo, setDeletingVideo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const initialFormData = {
    slug: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    thumbnail: '',
    duration: '',
    location: '',
    youtubeId: '',
    url: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleFetchMetadata = async (url: string) => {
    const id = extractYoutubeId(url);
    if (!id) return;

    setIsFetching(true);
    try {
      const data = await fetchMetadata({ url });
      
      if (data) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          date: data.date || prev.date,
          youtubeId: id,
          thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
          slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
        }));
      }
    } catch (err) {
      console.error('Failed to fetch YouTube metadata:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setFormData({
      ...video,
      url: `https://www.youtube.com/watch?v=${video.youtubeId}`
    });
    setIsAdding(true);
  };

  const handleDelete = async () => {
    if (!deletingVideo) return;
    try {
      await removeVideo({ id: deletingVideo._id });
      setDeletingVideo(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete video.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { url, ...submitData } = formData;
      if (editingVideo) {
        await updateVideo({ id: editingVideo._id, ...submitData });
      } else {
        await addVideo(submitData);
      }
      setIsAdding(false);
      setEditingVideo(null);
      setFormData(initialFormData);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${editingVideo ? 'update' : 'add'} video.`);
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Videos</h2>
          <p className="text-[#a0a0a0]">Manage your video content gallery.</p>
        </div>
        <button 
          onClick={() => {
            setEditingVideo(null);
            setFormData(initialFormData);
            setIsAdding(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Video
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0a0]" size={20} />
        <input
          type="text"
          placeholder="Search videos..."
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-2 pl-12 pr-4 focus:outline-none focus:border-[#ff3e00]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVideos.map((video) => (
          <motion.div
            key={video._id}
            layout
            className="glass flex flex-col p-4 group relative"
          >
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => handleEdit(video)}
                className="p-2 bg-black/60 rounded-full hover:bg-[#ff3e00] transition-colors"
                title="Edit Video"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => setDeletingVideo(video)}
                className="p-2 bg-black/60 rounded-full hover:bg-red-600 transition-colors"
                title="Delete Video"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="aspect-video bg-white/5 rounded-lg mb-4 overflow-hidden relative">
              {video.thumbnail ? (
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-purple-400">
                  <VideoIcon size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Youtube size={48} className="text-red-500" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 truncate">{video.title}</h3>
              <p className="text-sm text-[#a0a0a0] line-clamp-2 mb-4 h-10">{video.description}</p>
              <div className="flex justify-between items-center text-xs text-[#a0a0a0]">
                <span>{video.location}</span>
                <div className="flex items-center gap-3">
                  <span>{video.date}</span>
                  <span className="px-1.5 py-0.5 bg-white/5 rounded">{video.duration}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
            >
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingVideo(null);
                }}
                className="absolute top-4 right-4 text-[#a0a0a0] hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-bold mb-6">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">YouTube URL</label>
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-xs"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.url}
                      onChange={e => setFormData({...formData, url: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => handleFetchMetadata(formData.url)}
                      disabled={isFetching || !formData.url}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {isFetching ? <Loader2 className="animate-spin" size={16} /> : 'Fetch Info'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input 
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <input 
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-xs"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    required 
                    rows={3}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-sm"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input 
                      type="date"
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-xs"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <input 
                      placeholder="e.g. Tokyo, Japan"
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-xs"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <input 
                      placeholder="e.g. 10:24"
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-xs"
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                </div>

                {formData.thumbnail && (
                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium">Thumbnail Preview</label>
                    <div className="aspect-video rounded border border-[#333] overflow-hidden bg-black">
                      <img src={formData.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingVideo(null);
                    }}
                    className="px-4 py-2 text-[#a0a0a0] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                  >
                    {editingVideo ? 'Update Video' : 'Save Video'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {deletingVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass max-w-md w-full p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertTriangle className="text-red-500" size={32} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Delete Video</h3>
              <p className="text-[#a0a0a0] mb-8">
                Are you sure you want to delete <span className="text-white font-medium">"{deletingVideo.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeletingVideo(null)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
