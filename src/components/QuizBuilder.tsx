import React, { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Copy } from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  order: number;
}

interface QuizBuilderProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
  maxQuestions?: number;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ 
  questions, 
  onChange, 
  maxQuestions = 20 
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addQuestion = () => {
    if (questions.length >= maxQuestions) {
      toast.error(`Maximum ${maxQuestions} questions allowed`);
      return;
    }
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      order: questions.length,
    };
    onChange([...questions, newQuestion]);
    setExpandedIndex(questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
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
    const questionToDuplicate = questions[index];
    const newQuestion: QuizQuestion = {
      ...questionToDuplicate,
      id: `q-${Date.now()}`,
      order: questions.length,
    };
    onChange([...questions, newQuestion]);
    toast.success('Question duplicated');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-300">Quiz Questions</h3>
          <p className="text-xs text-slate-400">{questions.length}/{maxQuestions} questions</p>
        </div>
        {questions.length < maxQuestions && (
          <button
            onClick={addQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Plus size={14} /> Add Question
          </button>
        )}
      </div>

      <div className="space-y-2">
        {questions.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-700/50 rounded-lg">
            <p className="text-slate-400 text-xs">No quiz questions yet. Add your first question above!</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden"
            >
              {/* Question Header */}
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full w-8 h-8 flex items-center justify-center">
                    Q{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {question.question || 'New Question'}
                    </p>
                    <p className="text-xs text-slate-400">{question.options.filter(o => o).length} options</p>
                  </div>
                </div>
                <span className={`text-slate-400 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Question Details */}
              {expandedIndex === index && (
                <div className="border-t border-slate-700/50 p-4 space-y-4 bg-slate-900/20">
                  {/* Question Text */}
                  <div>
                    <label className="text-xs text-slate-300 font-medium mb-2 block">Question *</label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(index, { question: e.target.value })}
                      placeholder="Enter the question..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded text-xs resize-none min-h-12 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="text-xs text-slate-300 font-medium mb-3 block">Answer Options *</label>
                    <div className="space-y-2">
                      {question.options.map((option, optIdx) => (
                        <div key={optIdx} className="flex gap-2 items-start">
                          <input
                            type="radio"
                            name={`correct-${index}`}
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
                    {!question.correctAnswer && (
                      <p className="text-xs text-red-400 mt-2">⚠️ Please select a correct answer</p>
                    )}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="text-xs text-slate-300 font-medium mb-2 block">Explanation (Optional)</label>
                    <textarea
                      value={question.explanation || ''}
                      onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                      placeholder="Explain why this is the correct answer..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded text-xs resize-none min-h-16 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-700/30">
                    <button
                      onClick={() => moveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="flex-1 p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs transition-all flex items-center justify-center gap-1"
                      title="Move up"
                    >
                      <ChevronUp size={14} /> Move Up
                    </button>
                    <button
                      onClick={() => moveQuestion(index, 'down')}
                      disabled={index === questions.length - 1}
                      className="flex-1 p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs transition-all flex items-center justify-center gap-1"
                      title="Move down"
                    >
                      <ChevronDown size={14} /> Move Down
                    </button>
                    <button
                      onClick={() => duplicateQuestion(index)}
                      className="flex-1 p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded text-xs transition-all flex items-center justify-center gap-1"
                      title="Duplicate"
                    >
                      <Copy size={14} /> Duplicate
                    </button>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="flex-1 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded text-xs transition-all"
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
    </div>
  );
};

export default QuizBuilder;
