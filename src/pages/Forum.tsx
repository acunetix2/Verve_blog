import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Reply,
  Search,
  Plus,
  Filter,
  TrendingUp,
  Clock,
  User,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface ForumThread {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  category: string;
  views: number;
  replies: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const Forum = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '', category: 'general' });

  const categories = [
    { key: 'all', label: 'All Topics', color: 'gray' },
    { key: 'general', label: 'General Discussion', color: 'blue' },
    { key: 'rooms', label: 'Room Discussions', color: 'purple' },
    { key: 'help', label: 'Help & Support', color: 'green' },
    { key: 'showcase', label: 'Showcase', color: 'orange' },
  ];

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      // Mock data for now since endpoint might not exist
      const mockThreads: ForumThread[] = [
        {
          _id: '1',
          title: 'Tips for solving the Web Security room',
          content:
            'Has anyone solved the Web Security Fundamentals room? I\'m stuck on the SQL injection challenge...',
          author: { _id: '1', username: 'SecurityNinja', avatar: 'SN' },
          category: 'rooms',
          views: 2540,
          replies: 18,
          likes: 145,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '2',
          title: 'Welcome to VerveHub Forum!',
          content:
            'This is the official forum for VerveHub Academy. Share your experiences, ask questions, and help others learn.',
          author: { _id: '2', username: 'Admin', avatar: 'AD' },
          category: 'general',
          views: 5420,
          replies: 156,
          likes: 892,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '3',
          title: 'How do I improve my Linux skills?',
          content:
            'I want to get better at Linux. What are some good rooms to start with? I\'m a beginner.',
          author: { _id: '3', username: 'Learner99', avatar: 'L9' },
          category: 'help',
          views: 1850,
          replies: 27,
          likes: 234,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '4',
          title: 'Completed 100 rooms - Here\'s my journey',
          content:
            'I just hit 100 completed rooms! Sharing my experience and what I learned throughout this journey...',
          author: { _id: '4', username: 'ProHacker', avatar: 'PH' },
          category: 'showcase',
          views: 3210,
          replies: 45,
          likes: 567,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '5',
          title: 'Bug Report: Dashboard points not updating',
          content: 'The points on my dashboard haven\'t updated for 2 days even though I\'ve completed rooms.',
          author: { _id: '5', username: 'BugReporter', avatar: 'BR' },
          category: 'help',
          views: 892,
          replies: 12,
          likes: 45,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setThreads(mockThreads);
    } catch (error) {
      console.error('Error fetching forum threads:', error);
      toast.error('Failed to load forum threads');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('/api/forum/threads', newThread);
      setThreads([response.data.data, ...threads]);
      setNewThread({ title: '', content: '', category: 'general' });
      setShowNewThread(false);
      toast.success('Thread created successfully!');
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    }
  };

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.key === category);
    return cat?.color || 'gray';
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <MessageSquare className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold">Community Forum</h1>
            </div>
            <p className="text-gray-400">Join the discussion and help the community</p>
          </div>
          <button
            onClick={() => setShowNewThread(!showNewThread)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Thread</span>
          </button>
        </div>

        {/* New Thread Form */}
        {showNewThread && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4">Create New Discussion</h3>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  placeholder="What's on your mind?"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  value={newThread.content}
                  onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                  placeholder="Share your thoughts..."
                  rows={6}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={newThread.category}
                  onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  {categories
                    .filter((cat) => cat.key !== 'all')
                    .map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded text-white font-medium transition-all"
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewThread(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search discussions..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto space-x-2">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Threads List */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading forum threads...</div>
        ) : filteredThreads.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            {searchTerm ? 'No threads match your search' : 'No threads yet'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <div
                key={thread._id}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-850 transition-colors border border-gray-800 hover:border-gray-700 cursor-pointer"
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 hover:text-orange-400 transition-colors">
                      {thread.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="w-3 h-3" />
                      <span>{thread.author.username}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>Just now</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      getCategoryColor(thread.category) === 'blue'
                        ? 'bg-blue-500 bg-opacity-20 text-blue-300'
                        : getCategoryColor(thread.category) === 'purple'
                          ? 'bg-purple-500 bg-opacity-20 text-purple-300'
                          : getCategoryColor(thread.category) === 'green'
                            ? 'bg-green-500 bg-opacity-20 text-green-300'
                            : 'bg-orange-500 bg-opacity-20 text-orange-300'
                    }`}
                  >
                    {categories.find((c) => c.key === thread.category)?.label}
                  </span>
                </div>

                {/* Thread Content Preview */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{thread.content}</p>

                {/* Thread Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex space-x-6 text-sm text-gray-500">
                    <span className="flex items-center space-x-2 hover:text-orange-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{thread.views} views</span>
                    </span>
                    <span className="flex items-center space-x-2 hover:text-orange-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.replies} replies</span>
                    </span>
                    <span className="flex items-center space-x-2 hover:text-orange-400">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{thread.likes} likes</span>
                    </span>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 transition-all">
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
