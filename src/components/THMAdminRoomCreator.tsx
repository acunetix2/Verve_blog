import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  BookOpen,
  Target,
  Terminal,
  Trophy,
  Star,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  content: string;
  questions: Array<{
    id: string;
    question: string;
    hint: string;
    points: number;
    answer: string;
  }>;
  order: number;
}

interface Section {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  order: number;
  isExpanded: boolean;
}

interface RoomFormData {
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  roomType: 'learning' | 'challenge' | 'ctf';
  withCertificate: boolean;
  withBadge: boolean;
  pointsPerQuestion: number;
  sections: Section[];
}

const THMAdminRoomCreator: React.FC = () => {
  const [formData, setFormData] = useState<RoomFormData>({
    title: '',
    description: '',
    category: 'General',
    difficulty: 'Beginner',
    roomType: 'learning',
    withCertificate: false,
    withBadge: true,
    pointsPerQuestion: 8,
    sections: []
  });

  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: `Section ${formData.sections.length + 1}`,
      description: '',
      tasks: [],
      order: formData.sections.length,
      isExpanded: true
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      )
    }));
  };

  const addTask = (sectionId: string) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: `Task ${section.tasks.length + 1}`,
      description: '',
      content: '',
      questions: [],
      order: section.tasks.length
    };

    updateSection(sectionId, {
      tasks: [...section.tasks, newTask]
    });
  };

  const removeTask = (sectionId: string, taskId: string) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      tasks: section.tasks.filter(t => t.id !== taskId)
    });
  };

  const updateTask = (sectionId: string, taskId: string, updates: Partial<Task>) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      tasks: section.tasks.map(t =>
        t.id === taskId ? { ...t, ...updates } : t
      )
    });
  };

  const addQuestion = (sectionId: string, taskId: string) => {
    const section = formData.sections.find(s => s.id === sectionId);
    const task = section?.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newQuestion = {
      id: Date.now().toString(),
      question: '',
      hint: '',
      points: formData.pointsPerQuestion,
      answer: ''
    };

    updateTask(sectionId, taskId, {
      questions: [...task.questions, newQuestion]
    });
  };

  const removeQuestion = (sectionId: string, taskId: string, questionId: string) => {
    const section = formData.sections.find(s => s.id === sectionId);
    const task = section?.tasks.find(t => t.id === taskId);
    if (!task) return;

    updateTask(sectionId, taskId, {
      questions: task.questions.filter(q => q.id !== questionId)
    });
  };

  const updateQuestion = (sectionId: string, taskId: string, questionId: string, updates: any) => {
    const section = formData.sections.find(s => s.id === sectionId);
    const task = section?.tasks.find(t => t.id === taskId);
    if (!task) return;

    updateTask(sectionId, taskId, {
      questions: task.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description');
      return;
    }

    if (formData.sections.length === 0) {
      toast.error('Please add at least one section');
      return;
    }

    setSaving(true);
    try {
      const roomData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        roomType: formData.roomType,
        isRoom: true,
        sections: formData.sections,
        questions: formData.sections.flatMap(s =>
          s.tasks.flatMap(t => t.questions)
        ),
        rewards: {
          badge: formData.withBadge ? {
            name: `${formData.title} Master`,
            icon: '🎖️',
            color: 'orange'
          } : null,
          certificate: formData.withCertificate,
          pointsPerQuestion: formData.pointsPerQuestion,
          totalPoints: formData.sections.reduce((acc, s) =>
            acc + s.tasks.reduce((taskAcc, t) => taskAcc + t.questions.length, 0), 0
          ) * formData.pointsPerQuestion
        },
        status: 'published'
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses`,
        roomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(`Room "${formData.title}" created successfully!`);
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'General',
        difficulty: 'Beginner',
        roomType: 'learning',
        withCertificate: false,
        withBadge: true,
        pointsPerQuestion: 8,
        sections: []
      });
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to create room');
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-blue-400 border-blue-500';
      case 'Intermediate': return 'text-purple-400 border-purple-500';
      case 'Advanced': return 'text-orange-400 border-orange-500';
      case 'Expert': return 'text-red-400 border-red-500';
      default: return 'text-gray-400 border-gray-500';
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

  const totalQuestions = formData.sections.reduce((acc, s) =>
    acc + s.tasks.reduce((taskAcc, t) => taskAcc + t.questions.length, 0), 0
  );
  const totalPoints = totalQuestions * formData.pointsPerQuestion;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-['Product_Sans'] text-sm p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Create THM-Style Room</h1>
          <p className="text-gray-400">Build interactive learning rooms with sections, tasks, and questions</p>
        </div>

        {/* Room Configuration */}
        <div className="bg-[#1A1A1A] rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Room Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Room Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter room title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="e.g., Web Security, Networking..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Room Type</label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value as any }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="learning">Learning</option>
                <option value="challenge">Challenge</option>
                <option value="ctf">CTF</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Points per Question</label>
              <input
                type="number"
                value={formData.pointsPerQuestion}
                onChange={(e) => setFormData(prev => ({ ...prev, pointsPerQuestion: parseInt(e.target.value) || 8 }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
                min="1"
                max="50"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.withBadge}
                  onChange={(e) => setFormData(prev => ({ ...prev, withBadge: e.target.checked }))}
                  className="rounded border-gray-700"
                />
                <span className="text-sm">Badge</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.withCertificate}
                  onChange={(e) => setFormData(prev => ({ ...prev, withCertificate: e.target.checked }))}
                  className="rounded border-gray-700"
                />
                <span className="text-sm">Certificate</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-orange-500 h-20"
              placeholder="Describe what users will learn in this room..."
            />
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>{totalQuestions} questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>{totalPoints} total points</span>
            </div>
            <div className="flex items-center space-x-2">
              {getRoomTypeIcon(formData.roomType)}
              <span className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(formData.difficulty)}`}>
                {formData.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Room Sections</h2>
            <button
              onClick={addSection}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>

          {formData.sections.map((section) => (
            <div key={section.id} className="bg-[#1A1A1A] rounded-lg border border-gray-800">
              {/* Section Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateSection(section.id, { isExpanded: !section.isExpanded })}
                    className="text-gray-400 hover:text-white"
                  >
                    {section.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="bg-transparent border-none outline-none text-sm font-medium w-full"
                      placeholder="Section title..."
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{section.tasks.length} tasks</span>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section Content */}
              {section.isExpanded && (
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={section.description}
                      onChange={(e) => updateSection(section.id, { description: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-orange-500 h-16"
                      placeholder="Optional section description..."
                    />
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Tasks</h4>
                      <button
                        onClick={() => addTask(section.id)}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Task</span>
                      </button>
                    </div>

                    {section.tasks.map((task) => (
                      <div key={task.id} className="bg-gray-800 rounded p-3 border border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => updateTask(section.id, task.id, { title: e.target.value })}
                              className="bg-transparent border-none outline-none text-sm font-medium w-full mb-2"
                              placeholder="Task title..."
                            />
                            <textarea
                              value={task.description}
                              onChange={(e) => updateTask(section.id, task.id, { description: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-orange-500 text-xs h-12"
                              placeholder="Task description..."
                            />
                          </div>
                          <button
                            onClick={() => removeTask(section.id, task.id)}
                            className="text-red-400 hover:text-red-300 p-1 ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Task Content */}
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1">Content</label>
                          <textarea
                            value={task.content}
                            onChange={(e) => updateTask(section.id, task.id, { content: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-orange-500 text-xs h-20"
                            placeholder="Task content (supports HTML/markdown)..."
                          />
                        </div>

                        {/* Questions */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Questions ({task.questions.length})</span>
                            <button
                              onClick={() => addQuestion(section.id, task.id)}
                              className="flex items-center space-x-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Question</span>
                            </button>
                          </div>

                          {task.questions.map((question) => (
                            <div key={question.id} className="bg-gray-900 rounded p-2 border border-gray-600">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                <input
                                  type="text"
                                  value={question.question}
                                  onChange={(e) => updateQuestion(section.id, task.id, question.id, { question: e.target.value })}
                                  className="bg-transparent border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
                                  placeholder="Question..."
                                />
                                <input
                                  type="text"
                                  value={question.answer}
                                  onChange={(e) => updateQuestion(section.id, task.id, question.id, { answer: e.target.value })}
                                  className="bg-transparent border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
                                  placeholder="Answer..."
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={question.hint}
                                  onChange={(e) => updateQuestion(section.id, task.id, question.id, { hint: e.target.value })}
                                  className="flex-1 bg-transparent border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
                                  placeholder="Hint (optional)..."
                                />
                                <input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => updateQuestion(section.id, task.id, question.id, { points: parseInt(e.target.value) || 8 })}
                                  className="w-16 bg-transparent border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
                                  min="1"
                                />
                                <button
                                  onClick={() => removeQuestion(section.id, task.id, question.id)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !formData.title || !formData.description || formData.sections.length === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Creating Room...' : 'Create Room'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default THMAdminRoomCreator;