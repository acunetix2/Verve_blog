import React, { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ExamQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  order: number;
}

interface FinalExamBuilderProps {
  questions: ExamQuestion[];
  onChange: (questions: ExamQuestion[]) => void;
  passingScore?: number;
  onPassingScoreChange?: (score: number) => void;
  onEnabledChange?: (enabled: boolean) => void;
  isEnabled?: boolean;
}

export const FinalExamBuilder: React.FC<FinalExamBuilderProps> = ({ 
  questions, 
  onChange,
  passingScore = 70,
  onPassingScoreChange,
  onEnabledChange,
  isEnabled = false
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const MAX_QUESTIONS = 30;
  const requiredQuestions = 30;

  const addQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) {
      toast.error(`Maximum ${MAX_QUESTIONS} questions allowed for final exam`);
      return;
    }
    const newQuestion: ExamQuestion = {
      id: `exam-q-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      order: questions.length,
    };
    onChange([...questions, newQuestion]);
    setExpandedIndex(questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<ExamQuestion>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    onChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === questions.length - 1)) {
      return;
    }
    const newQuestions = [...questions];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[swapIndex]] = [newQuestions[swapIndex], newQuestions[index]];
    onChange(newQuestions.map((q, i) => ({ ...q, order: i })));
    setExpandedIndex(swapIndex);
  };

  const duplicateQuestion = (index: number) => {
    if (questions.length >= MAX_QUESTIONS) {
      toast.error(`Maximum ${MAX_QUESTIONS} questions allowed`);
      return;
    }
    const questionToDuplicate = questions[index];
    const newQuestion: ExamQuestion = {
      ...questionToDuplicate,
      id: `exam-q-${Date.now()}`,
      order: questions.length,
    };
    onChange([...questions, newQuestion]);
    toast.success('Question duplicated');
  };

  const isValid = questions.length === MAX_QUESTIONS && questions.every(q => q.question && q.correctAnswer);
  const progress = Math.round((questions.length / MAX_QUESTIONS) * 100);

  return (
    <div className="space-y-4">
      {/* Header and Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300">Final Course Exam</h3>
            <p className="text-xs text-slate-400">Required: {requiredQuestions} multiple choice questions</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => onEnabledChange?.(e.target.checked)}
              className="accent-green-500"
            />
            <span className="text-xs text-slate-300">Enable Final Exam</span>
          </label>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">Questions: {questions.length}/{MAX_QUESTIONS}</span>
            <span className={`text-xs font-semibold ${progress === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
              {progress}%
            </span>
          </div>
          <div className="bg-slate-700/30 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <div
              className={`h-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Passing Score */}
        <div>
          <label className="text-xs text-slate-300 font-medium mb-2 block">Passing Score (%)</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="50"
              max="100"
              step="5"
              value={passingScore}
              onChange={(e) => onPassingScoreChange?.(Math.min(100, Math.max(50, parseInt(e.target.value))))}
              className="flex-1 bg-slate-900/50 border border-slate-700/50 text-white px-3 py-2 rounded text-xs focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
            <span className="text-slate-400 text-xs pt-2">Minimum: 50%</span>
          </div>
        </div>

        {/* Validation Status */}
        {!isValid && (
          <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 flex gap-2">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-300">
              <p className="font-semibold">Exam not ready</p>
              <p>You need {MAX_QUESTIONS - questions.length} more questions with all fields filled</p>
            </div>
          </div>
        )}
        {isValid && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex gap-2">
            <div className="text-xs text-green-300">
              <p className="font-semibold">✓ Exam is ready</p>
              <p>All {MAX_QUESTIONS} questions are configured properly</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Question Button */}
      {questions.length < MAX_QUESTIONS && (
        <button
          onClick={addQuestion}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-medium"
        >
          <Plus size={14} /> Add Exam Question ({questions.length}/{MAX_QUESTIONS})
        </button>
      )}

      {/* Questions List */}
      <div className="space-y-2">
        {questions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-lg">
            <AlertCircle className="mx-auto mb-3 text-slate-400" size={32} />
            <p className="text-slate-400 text-sm font-medium">No exam questions yet</p>
            <p className="text-slate-500 text-xs mt-1">Start creating your 30-question final exam</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={index}
              className={`border rounded-lg overflow-hidden transition-all ${
                !question.question || !question.correctAnswer
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <span className={`${
                    question.question && question.correctAnswer
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  } text-xs font-bold px-3 py-1 rounded-full min-w-12 text-center`}>
                    Q{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      question.question ? 'text-white' : 'text-slate-500'
                    }`}>
                      {question.question || 'New Question'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {question.options.filter(o => o).length} options
                      {question.correctAnswer && ` • Answer: ${question.correctAnswer.substring(0, 20)}...`}
                    </p>
                  </div>
                </div>
                <span className={`text-slate-400 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Question Details */}
              {expandedIndex === index && (
                <div className="border-t border-slate-700/50 p-4 space-y-4 bg-slate-900/30">
                  {/* Question Text */}
                  <div>
                    <label className="text-xs text-slate-300 font-medium mb-2 block">Question *</label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(index, { question: e.target.value })}
                      placeholder="Enter the exam question..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded text-xs resize-none min-h-12 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="text-xs text-slate-300 font-medium mb-3 block">Answer Options * (Select correct answer)</label>
                    <div className="space-y-2">
                      {question.options.map((option, optIdx) => (
                        <div key={optIdx} className="flex gap-2 items-start">
                          <input
                            type="radio"
                            name={`exam-correct-${index}`}
                            checked={question.correctAnswer === option}
                            onChange={() => updateQuestion(index, { correctAnswer: option })}
                            disabled={!option}
                            className="mt-2.5 accent-green-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, optIdx, e.target.value)}
                            placeholder={`Option ${optIdx + 1}`}
                            className="flex-1 bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded text-xs focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="text-xs text-slate-300 font-medium mb-2 block">Explanation (Optional)</label>
                    <textarea
                      value={question.explanation || ''}
                      onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                      placeholder="Explain why this is correct (shown after exam)..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded text-xs resize-none min-h-16 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-700/30 flex-wrap">
                    <button
                      onClick={() => moveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="flex-1 min-w-[120px] p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs transition-all flex items-center justify-center gap-1"
                      title="Move up"
                    >
                      <ChevronUp size={14} /> Move Up
                    </button>
                    <button
                      onClick={() => moveQuestion(index, 'down')}
                      disabled={index === questions.length - 1}
                      className="flex-1 min-w-[120px] p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs transition-all flex items-center justify-center gap-1"
                      title="Move down"
                    >
                      <ChevronDown size={14} /> Move Down
                    </button>
                    <button
                      onClick={() => duplicateQuestion(index)}
                      className="flex-1 min-w-[120px] p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded text-xs transition-all flex items-center justify-center gap-1"
                      title="Duplicate"
                    >
                      <Copy size={14} /> Duplicate
                    </button>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="flex-1 min-w-[120px] p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded text-xs transition-all flex items-center justify-center gap-1"
                      title="Delete"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Status Footer */}
      {questions.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-700/30 rounded-lg p-3 text-xs text-slate-400">
          <p>
            {questions.filter(q => q.question && q.correctAnswer).length}/{MAX_QUESTIONS} questions complete
            {isValid && ' • ✓ Ready to enable'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FinalExamBuilder;
