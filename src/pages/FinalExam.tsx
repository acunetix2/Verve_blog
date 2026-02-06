import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, Loader2, Award, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import CertificateDisplay from '../components/CertificateDisplay';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface FinalExam {
  questions: Question[];
  passingScore: number;
  duration?: number;
  isEnabled: boolean;
}

interface Certificate {
  _id: string;
  courseTitle: string;
  userName: string;
  certificateNumber: string;
  completionDate: string;
  totalQuizScore?: number;
  isDownloaded?: boolean;
  downloadedAt?: string;
}

const FinalExam: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<FinalExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [token] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    fetchExam();
  }, [courseId]);

  // Timer countdown
  useEffect(() => {
    if (!exam || !exam.duration || submitted || timeLeft === null) return;

    if (timeLeft === 0) {
      handleSubmitExam();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, exam, submitted]);

  const fetchExam = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const finalExam = response.data.finalExam;

      if (!finalExam || !finalExam.isEnabled) {
        toast.error('Final exam is not available for this course');
        navigate(`/v/courses/${courseId}`);
        return;
      }

      setExam(finalExam);

      // Start timer if duration is set
      if (finalExam.duration) {
        setTimeLeft(finalExam.duration * 60);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch exam:', error);
      toast.error('Failed to load exam');
      navigate(`/v/courses/${courseId}`);
    }
  };

  const handleAnswer = (questionIdx: number, answer: string) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [questionIdx]: answer }));
    }
  };

  const handleSubmitExam = async () => {
    if (!exam) return;

    // Calculate score
    let correctAnswers = 0;
    exam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    // Submit to backend
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/exam/submit`,
        { answers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { score: backendScore, passed, certificate: cert, detailedResults } = response.data;
      
      setScore(backendScore);
      setSubmitted(true);

      if (passed && cert) {
        setCertificate(cert);
        setShowCertificate(true);
        toast.success('Congratulations! You passed the exam and earned your certificate!');
      } else {
        toast.error(`You scored ${backendScore}%. Passing score: ${exam.passingScore}%`);
      }
    } catch (error) {
      console.error('Failed to submit exam:', error);
      toast.error('Failed to submit exam. Please try again.');
      
      // Fallback to client-side calculation
      const correctAnswers = exam.questions.filter((q, idx) => answers[idx] === q.correctAnswer).length;
      const calculatedScore = Math.round((correctAnswers / exam.questions.length) * 100);
      
      setScore(calculatedScore);
      setSubmitted(true);
      
      if (calculatedScore >= exam.passingScore) {
        toast.success('Exam submitted! Certificate will be generated shortly.');
      } else {
        toast.error(`You scored ${calculatedScore}%. Passing score: ${exam.passingScore}%`);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading final exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 text-sm">Exam not found</p>
      </div>
    );
  }

  const isTimeRunningOut = timeLeft !== null && timeLeft < 300; // 5 minutes

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/v/courses/${courseId}`)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Course
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Final Examination</h1>
              <p className="text-gray-600 text-sm mt-2">
                Complete all questions to earn your course certificate
              </p>
            </div>

            {/* Timer */}
            {timeLeft !== null && (
              <div
                className={`text-center p-4 rounded-lg border-2 ${
                  isTimeRunningOut
                    ? 'bg-red-50 border-red-300'
                    : 'bg-blue-50 border-blue-300'
                }`}
              >
                <p className="text-xs text-gray-600 font-semibold">Time Remaining</p>
                <p
                  className={`text-2xl font-bold ${
                    isTimeRunningOut ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {formatTime(timeLeft)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Questions Answered: {Object.keys(answers).length} / {exam.questions.length}
            </p>
            <p className="text-sm font-semibold text-gray-600">
              Passing Score: {exam.passingScore}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(Object.keys(answers).length / exam.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Result Section */}
        {submitted && (
          <div className="mb-8 p-6 rounded-lg border-2">
            <div
              className={`flex items-center gap-3 ${
                score >= exam.passingScore
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              {score >= exam.passingScore ? (
                <CheckCircle2 className="text-green-600" size={24} />
              ) : (
                <AlertCircle className="text-red-600" size={24} />
              )}
              <div>
                <p
                  className={`font-bold text-lg ${
                    score >= exam.passingScore
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {score >= exam.passingScore ? '✓ Passed!' : '✗ Not Passed'}
                </p>
                <p className="text-sm text-gray-700">
                  Your Score: <span className="font-bold">{score}%</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-8 mb-8">
          {exam.questions.map((question, qIdx) => {
            const isAnswered = answers[qIdx] !== undefined;
            const isCorrect =
              submitted && answers[qIdx] === question.correctAnswer;
            const isWrong = submitted && isAnswered && !isCorrect;

            return (
              <div
                key={qIdx}
                className={`p-6 rounded-lg border-2 transition ${
                  submitted
                    ? isCorrect
                      ? 'bg-green-50 border-green-300'
                      : isWrong
                      ? 'bg-red-50 border-red-300'
                      : 'bg-gray-50 border-gray-200'
                    : isAnswered
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-sm flex-1">
                    Question {qIdx + 1} of {exam.questions.length}
                  </h3>
                  {submitted && (
                    <div className="ml-4">
                      {isCorrect && (
                        <CheckCircle2 className="text-green-600" size={20} />
                      )}
                      {isWrong && (
                        <AlertCircle className="text-red-600" size={20} />
                      )}
                    </div>
                  )}
                </div>

                <p className="text-gray-800 font-semibold mb-4 text-sm">
                  {question.question}
                </p>

                <div className="space-y-2">
                  {question.options.map((option, oIdx) => {
                    const isSelected = answers[qIdx] === option;
                    const isCorrectOption =
                      submitted && option === question.correctAnswer;
                    const isWrongSelection =
                      submitted && isSelected && !isCorrectOption;

                    return (
                      <label
                        key={oIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition text-sm ${
                          isCorrectOption
                            ? 'bg-green-100 border-green-400'
                            : isWrongSelection
                            ? 'bg-red-100 border-red-400'
                            : isSelected
                            ? 'bg-blue-100 border-blue-400'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIdx}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleAnswer(qIdx, option)}
                          disabled={submitted}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span
                          className={`${
                            isCorrectOption || isWrongSelection
                              ? 'font-bold'
                              : ''
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/v/courses/${courseId}`)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitExam}
              disabled={Object.keys(answers).length < exam.questions.length}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle2 size={18} />
              Submit Exam
            </button>
          </div>
        )}

        {/* After Submission */}
        {submitted && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/v/courses/${courseId}`)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition text-sm"
            >
              Back to Course
            </button>

            {score >= exam.passingScore && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Award size={18} />
                View Certificate
              </button>
            )}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && certificate && (
        <CertificateDisplay
          certificate={certificate}
          onClose={() => setShowCertificate(false)}
          courseId={courseId}
        />
      )}
    </div>
  );
};

export default FinalExam;
