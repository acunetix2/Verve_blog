import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, BookOpen, Users, Clock, Star, TrendingUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  modules?: any[];
  rating?: number;
  students?: number;
  tier?: string;
  pricing?: { oneTimeFee?: number };
}

const AdvancedCoursesList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token'));

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [courses, searchTerm, difficultyFilter, priceFilter, sortBy]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses`);
      setCourses(response.data || []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...courses];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(c => c.difficulty === difficultyFilter);
    }

    // Price
    if (priceFilter === 'free') {
      filtered = filtered.filter(c => c.tier === 'free' || c.pricing?.oneTimeFee === 0);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(c => c.pricing?.oneTimeFee && c.pricing.oneTimeFee > 0);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'trending':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFilteredCourses(filtered);
    setPage(1);
  };

  const getDifficultyColor = (difficulty?: string) => {
    const colors = {
      beginner: 'bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      intermediate: 'bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      advanced: 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[difficulty as keyof typeof colors] || colors.beginner;
  };

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Courses</h1>
          <p className="text-blue-100 text-lg">Discover and master new skills from industry experts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses, skills, instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h3>

              {/* Difficulty Filter */}
              <div className="border-b dark:border-gray-700 pb-4">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Difficulty</h4>
                <div className="space-y-2">
                  {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={difficultyFilter === level}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="capitalize text-gray-700 dark:text-gray-300">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-b dark:border-gray-700 pb-4">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Price</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'free', label: 'Free' },
                    { value: 'paid', label: 'Paid' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={priceFilter === option.value}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Sort By</h4>
                <div className="space-y-2">
                  {[
                    { value: 'newest', label: 'Newest' },
                    { value: 'popular', label: 'Most Popular' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'trending', label: 'Trending' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setDifficultyFilter('all');
                  setPriceFilter('all');
                  setSortBy('newest');
                }}
                className="w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} courses
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 flex items-center gap-2"
              >
                <Filter size={18} />
                Filters
              </button>
            </div>

            {/* Courses Grid */}
            {paginatedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => navigate(`/v/courses/${course._id}`)}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden group">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={48} className="text-white/50" />
                        </div>
                      )}
                      {course.tier === 'premium' && (
                        <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Premium
                        </div>
                      )}
                      {course.tier === 'free' && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Free
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900 dark:text-white">
                        {course.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                        {course.description}
                      </p>

                      {/* Badge */}
                      {course.difficulty && (
                        <div className="mb-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                          </span>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-400" />
                          <span className="font-semibold">{(course.rating || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{(course.students || 0).toLocaleString()} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{course.modules?.length || 0} modules</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-2 py-2">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`px-3 py-2 rounded-lg transition ${
                            p === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCoursesList;
