import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Lock,
  BookOpen,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Terminal,
  Target,
  Trophy,
  Zap,
  Star,
  AlertCircle,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Task {
  _id?: string;
  title: string;
  description: string;
  content: string;
  questions?: Array<{
    _id: string;
    question: string;
    hint?: string;
    points: number;
    answer?: string;
  }>;
  order: number;
  isCompleted?: boolean;
}

interface Section {
  _id?: string;
  title: string;
  description?: string;
  tasks: Task[];
  order: number;
  isExpanded?: boolean;
}

interface Room {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  roomType: 'learning' | 'challenge' | 'ctf';
  category: string;
  sections: Section[];
  rewards: {
    badge?: { name: string; icon: string; color: string };
    certificate: boolean;
    pointsPerQuestion: number;
    totalPoints: number;
  };
  createdAt?: string;
}

interface UserProgress {
  answeredQuestions?: { questionId: string; isCorrect: boolean; points: number; answeredAt: string }[];
  pointsEarned?: number;
  enrolledAt?: string;
  completedAt?: string;
}

const THMRoomDetail: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedTask, setSelectedTask] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchRoomData();
    fetchUserProgress();
  }, [roomId]);

  const fetchRoomData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${roomId}`);
      setRoom(res.data);
    } catch (error) {
      console.error('Failed to fetch room:', error);
      toast.error('Failed to load room');
    }
  };

  const fetchUserProgress = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${roomId}/progress`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserProgress(res.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionIndex: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionIndex)) {
      newExpanded.delete(sectionIndex);
    } else {
      newExpanded.add(sectionIndex);
    }
    setExpandedSections(newExpanded);
  };

  const submitAnswer = async (questionId: string) => {
    if (!currentAnswer.trim() || !token) return;

    setSubmittingAnswer(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${roomId}/question/submit`,
        { questionId, answer: currentAnswer.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.isCorrect) {
        toast.success(`Correct! +${res.data.points} points`);
        setCurrentAnswer('');
        fetchUserProgress(); // Refresh progress
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-blue-400';
      case 'Intermediate': return 'text-purple-400';
      case 'Advanced': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'learning': return <BookOpen className="w-4 h-4" />;
      case 'challenge': return <Target className="w-4 h-4" />;
      case 'ctf': return <Terminal className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const isQuestionAnswered = (questionId: string) => {
    return userProgress?.answeredQuestions?.some(q => q.questionId === questionId) || false;
  };

  const getAnsweredQuestion = (questionId: string) => {
    return userProgress?.answeredQuestions?.find(q => q.questionId === questionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Room Not Found</h2>
          <p className="text-gray-400">The room you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentSection = room.sections[selectedSection];
  const currentTask = currentSection?.tasks[selectedTask];
  const answeredQuestions = userProgress?.answeredQuestions?.length || 0;
  const totalQuestions = room.sections.reduce((acc, section) => acc + section.tasks.reduce((taskAcc, task) => taskAcc + (task.questions?.length || 0), 0), 0);
  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-['Product_Sans'] text-sm">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/rooms')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Rooms</span>
            </button>
            <div className="flex items-center space-x-2">
              {getRoomTypeIcon(room.roomType)}
              <h1 className="text-lg font-semibold">{room.title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(room.difficulty)} bg-opacity-20 border border-current`}>
                {room.difficulty}
              </div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-400">{room.category}</div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Trophy className="w-4 h-4" />
              <span>{room.rewards.totalPoints} pts</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Progress</span>
            <span>{answeredQuestions}/{totalQuestions} questions • {progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Sidebar - Sections */}
        <div className="w-80 bg-[#1A1A1A] border-r border-gray-800 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Room Sections</h3>
            <div className="space-y-2">
              {room.sections.map((section, sectionIndex) => (
                <div key={section._id || sectionIndex}>
                  <button
                    onClick={() => {
                      setSelectedSection(sectionIndex);
                      setSelectedTask(0);
                      toggleSection(sectionIndex);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSection === sectionIndex
                        ? 'bg-orange-500 bg-opacity-20 border border-orange-500'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{sectionIndex + 1}</span>
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                      {expandedSections.has(sectionIndex) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {section.tasks.length} tasks
                    </div>
                  </button>

                  {/* Tasks */}
                  {expandedSections.has(sectionIndex) && (
                    <div className="ml-4 mt-2 space-y-1">
                      {section.tasks.map((task, taskIndex) => (
                        <button
                          key={task._id || taskIndex}
                          onClick={() => {
                            setSelectedSection(sectionIndex);
                            setSelectedTask(taskIndex);
                          }}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            selectedSection === sectionIndex && selectedTask === taskIndex
                              ? 'bg-orange-500 bg-opacity-10 text-orange-400'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">{taskIndex + 1}</span>
                            <span>{task.title}</span>
                            {task.questions?.length > 0 && (
                              <span className="text-xs text-gray-500">
                                ({task.questions.length} questions)
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {currentTask && (
            <div className="p-6">
              {/* Task Header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{currentTask.title}</h2>
                {currentTask.description && (
                  <p className="text-gray-400 text-sm">{currentTask.description}</p>
                )}
              </div>

              {/* Task Content */}
              <div className="prose prose-invert max-w-none mb-8">
                <div
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentTask.content }}
                />
              </div>

              {/* Questions */}
              {currentTask.questions && currentTask.questions.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Questions</span>
                  </h3>

                  {currentTask.questions.map((question, qIndex) => {
                    const answered = getAnsweredQuestion(question._id);
                    const isAnswered = !!answered;

                    return (
                      <div key={question._id} className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">{question.question}</h4>
                            {question.hint && (
                              <p className="text-xs text-gray-500 mb-2">Hint: {question.hint}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{question.points} pts</span>
                            {isAnswered && (
                              answered.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )
                            )}
                          </div>
                        </div>

                        {!isAnswered ? (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Enter your answer..."
                              value={currentAnswer}
                              onChange={(e) => setCurrentAnswer(e.target.value)}
                              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  submitAnswer(question._id);
                                }
                              }}
                            />
                            <button
                              onClick={() => submitAnswer(question._id)}
                              disabled={submittingAnswer || !currentAnswer.trim()}
                              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-medium transition-colors"
                            >
                              {submittingAnswer ? (
                                <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                'Submit'
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className={`p-2 rounded text-sm ${
                            answered.isCorrect
                              ? 'bg-green-500 bg-opacity-10 border border-green-500'
                              : 'bg-red-500 bg-opacity-10 border border-red-500'
                          }`}>
                            <div className="flex items-center space-x-2">
                              {answered.isCorrect ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )}
                              <span className={answered.isCorrect ? 'text-green-400' : 'text-red-400'}>
                                {answered.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                              <span className="text-gray-400">
                                (+{answered.points} points)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default THMRoomDetail;