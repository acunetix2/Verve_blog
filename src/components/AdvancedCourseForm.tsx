import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { toast } from "sonner";
import CourseContentEditor from "./CourseContentEditor";
import QuizBuilder from "./QuizBuilder";
import FinalExamBuilder from "./FinalExamBuilder";

interface Lesson {
  id?: string;
  title: string;
  contentBlocks?: any[];
  content?: string;
  quiz?: any[];
  order: number;
}

interface Module {
  id?: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

interface CourseFormData {
  title: string;
  description: string;
  image: string;
  modules: Module[];
  finalExam?: {
    questions: any[];
    passingScore: number;
    isEnabled: boolean;
  };
}

interface AdvancedCourseFormProps {
  initialData?: CourseFormData;
  onSave: (data: CourseFormData, status?: 'draft' | 'published') => Promise<void>;
  loading?: boolean;
}

export interface AdvancedCourseFormHandle {
  submit: () => Promise<void>;
  submitDraft: () => Promise<void>;
}

export const AdvancedCourseForm = forwardRef<AdvancedCourseFormHandle, AdvancedCourseFormProps>(
  ({ initialData, onSave, loading = false }, ref) => {
  const [courseForm, setCourseForm] = useState<CourseFormData>(
    initialData || {
      title: "",
      description: "",
      image: "",
      modules: [],
      finalExam: {
        questions: [],
        passingScore: 70,
        isEnabled: false,
      },
    }
  );

  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(null);
  const [expandedLessonIndex, setExpandedLessonIndex] = useState<{ module: number; lesson: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'finalExam'>('content');

  const addModule = () => {
    const newModules = [
      ...courseForm.modules,
      { id: `mod-${Date.now()}`, title: "", description: "", lessons: [], order: courseForm.modules.length },
    ];
    setCourseForm({ ...courseForm, modules: newModules });
    setExpandedModuleIndex(newModules.length - 1);
  };

  const removeModule = (index: number) => {
    const newModules = courseForm.modules.filter((_, i) => i !== index);
    setCourseForm({ ...courseForm, modules: newModules });
    setExpandedModuleIndex(null);
  };

  const updateModule = (index: number, field: string, value: any) => {
    const newModules = [...courseForm.modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setCourseForm({ ...courseForm, modules: newModules });
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...courseForm.modules];
    newModules[moduleIndex].lessons.push({
      id: `les-${Date.now()}`,
      title: "",
      content: "",
      contentBlocks: [],
      quiz: [],
      order: newModules[moduleIndex].lessons.length,
    });
    setCourseForm({ ...courseForm, modules: newModules });
    setExpandedLessonIndex({ module: moduleIndex, lesson: newModules[moduleIndex].lessons.length - 1 });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...courseForm.modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setCourseForm({ ...courseForm, modules: newModules });
    setExpandedLessonIndex(null);
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const newModules = [...courseForm.modules];
    newModules[moduleIndex].lessons[lessonIndex] = {
      ...newModules[moduleIndex].lessons[lessonIndex],
      [field]: value,
    };
    setCourseForm({ ...courseForm, modules: newModules });
  };

  const handleSave = async () => {
    if (!courseForm.title || !courseForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await onSave(courseForm, 'published');
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleSaveDraft = async () => {
    if (!courseForm.title) {
      toast.error("Please provide a course title at minimum");
      return;
    }
    try {
      await onSave(courseForm, 'draft');
      toast.success("Course saved as draft. You can continue editing anytime.");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // Expose both handlers via ref
  useImperativeHandle(ref, () => ({
    submit: handleSave,
    submitDraft: handleSaveDraft,
  }));

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      {/* Basic Info Section */}
      <div className="space-y-4 pb-6 border-b border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Course Details</h3>
        <div>
          <label className="text-slate-300 text-sm font-medium mb-2 block">Course Title *</label>
          <input
            type="text"
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            placeholder="Enter course title"
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-4 py-2.5 rounded-lg focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium mb-2 block">Description *</label>
          <textarea
            value={courseForm.description}
            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            placeholder="Enter course description"
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-4 py-2.5 rounded-lg focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all resize-none h-20"
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium mb-2 block">Image URL</label>
          <input
            type="text"
            value={courseForm.image}
            onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
            placeholder="Enter image URL (optional)"
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-4 py-2.5 rounded-lg focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>
      </div>

      {/* Modules & Lessons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Modules & Lessons</h3>
          <button
            onClick={addModule}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all text-xs font-medium"
          >
            <Plus size={14} />
            Add Module
          </button>
        </div>

        {courseForm.modules.length === 0 ? (
          <div className="text-center py-6 text-slate-400 border border-dashed border-slate-700/50 rounded-lg">
            <p className="text-sm">No modules yet. Click "Add Module" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {courseForm.modules.map((module, moduleIdx) => (
              <div key={moduleIdx} className="bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden">
                {/* Module Header */}
                <button
                  onClick={() => setExpandedModuleIndex(expandedModuleIndex === moduleIdx ? null : moduleIdx)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded">M{moduleIdx + 1}</span>
                    <div>
                      <p className="text-white font-medium">{module.title || "New Module"}</p>
                      <p className="text-xs text-slate-400">{module.lessons.length} lessons</p>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform ${expandedModuleIndex === moduleIdx ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Module Details */}
                {expandedModuleIndex === moduleIdx && (
                  <div className="border-t border-slate-700/50 p-4 bg-slate-800/30 space-y-4">
                    <div>
                      <label className="text-slate-300 text-xs font-medium mb-2 block">Module Title</label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(moduleIdx, "title", e.target.value)}
                        placeholder="Module title"
                        className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded-lg focus:border-blue-500/50 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-xs font-medium mb-2 block">Module Description</label>
                      <textarea
                        value={module.description || ""}
                        onChange={(e) => updateModule(moduleIdx, "description", e.target.value)}
                        placeholder="Module description"
                        className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded-lg focus:border-blue-500/50 focus:outline-none text-sm resize-none h-16"
                      />
                    </div>

                    {/* Lessons */}
                    <div className="pt-2 border-t border-slate-700/30">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-slate-300 text-xs font-medium">Lessons</label>
                        <button
                          onClick={() => addLesson(moduleIdx)}
                          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs transition-all"
                        >
                          <Plus size={12} />
                          Add Lesson
                        </button>
                      </div>

                      {module.lessons.length === 0 ? (
                        <p className="text-xs text-slate-500 py-2">No lessons yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIdx) => {
                            const isExpanded = expandedLessonIndex?.module === moduleIdx && expandedLessonIndex?.lesson === lessonIdx;
                            return (
                              <div key={lessonIdx} className="bg-slate-800/50 border border-slate-700/30 rounded-lg overflow-hidden">
                                {/* Lesson Header */}
                                <button
                                  onClick={() =>
                                    setExpandedLessonIndex(
                                      isExpanded ? null : { module: moduleIdx, lesson: lessonIdx }
                                    )
                                  }
                                  className="w-full p-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                                >
                                  <div className="flex items-center gap-2 flex-1 text-left">
                                    <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-0.5 rounded">L{lessonIdx + 1}</span>
                                    <p className="text-sm text-white font-medium">{lesson.title || "New Lesson"}</p>
                                  </div>
                                  <ChevronUp
                                    size={16}
                                    className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                  />
                                </button>

                                {/* Lesson Details */}
                                {isExpanded && (
                                  <div className="border-t border-slate-700/30 p-3 bg-slate-900/20 space-y-4">
                                    {/* Lesson Title */}
                                    <div>
                                      <label className="text-slate-300 text-xs font-medium mb-2 block">Lesson Title</label>
                                      <input
                                        type="text"
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(moduleIdx, lessonIdx, "title", e.target.value)}
                                        placeholder="Lesson title"
                                        className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded-lg focus:border-blue-500/50 focus:outline-none text-xs"
                                      />
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex gap-1 border-b border-slate-700/30">
                                      <button
                                        onClick={() => setActiveTab('content')}
                                        className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                                          activeTab === 'content'
                                            ? 'border-blue-500 text-blue-400'
                                            : 'border-transparent text-slate-400 hover:text-white'
                                        }`}
                                      >
                                        Content
                                      </button>
                                      <button
                                        onClick={() => setActiveTab('quiz')}
                                        className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                                          activeTab === 'quiz'
                                            ? 'border-blue-500 text-blue-400'
                                            : 'border-transparent text-slate-400 hover:text-white'
                                        }`}
                                      >
                                        Lesson Quiz
                                      </button>
                                    </div>

                                    {/* Content Tab */}
                                    {activeTab === 'content' && (
                                      <div>
                                        <label className="text-slate-300 text-xs font-medium mb-2 block">Lesson Content Structure</label>
                                        <CourseContentEditor
                                          blocks={lesson.contentBlocks || []}
                                          onChange={(blocks) =>
                                            updateLesson(moduleIdx, lessonIdx, "contentBlocks", blocks)
                                          }
                                        />
                                      </div>
                                    )}

                                    {/* Quiz Tab */}
                                    {activeTab === 'quiz' && (
                                      <div>
                                        <QuizBuilder
                                          questions={lesson.quiz || []}
                                          onChange={(questions) =>
                                            updateLesson(moduleIdx, lessonIdx, "quiz", questions)
                                          }
                                          maxQuestions={10}
                                        />
                                      </div>
                                    )}

                                    {/* Delete Lesson */}
                                    <div className="pt-2 border-t border-slate-700/30">
                                      <button
                                        onClick={() => removeLesson(moduleIdx, lessonIdx)}
                                        className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs px-3 py-2 rounded transition-all border border-red-500/30"
                                      >
                                        Delete Lesson
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Delete Module */}
                    <button
                      onClick={() => removeModule(moduleIdx)}
                      className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs px-3 py-2 rounded transition-all border border-red-500/30"
                    >
                      Delete Module
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Final Exam Section */}
      <div className="border-t border-slate-700/50 pt-6">
        <FinalExamBuilder
          questions={courseForm.finalExam?.questions || []}
          onChange={(questions) =>
            setCourseForm({
              ...courseForm,
              finalExam: { ...courseForm.finalExam!, questions },
            })
          }
          passingScore={courseForm.finalExam?.passingScore || 70}
          onPassingScoreChange={(score) =>
            setCourseForm({
              ...courseForm,
              finalExam: { ...courseForm.finalExam!, passingScore: score },
            })
          }
          isEnabled={courseForm.finalExam?.isEnabled || false}
          onEnabledChange={(enabled) =>
            setCourseForm({
              ...courseForm,
              finalExam: { ...courseForm.finalExam!, isEnabled: enabled },
            })
          }
        />
      </div>
    </div>
  );
});

AdvancedCourseForm.displayName = "AdvancedCourseForm";

export default AdvancedCourseForm;
