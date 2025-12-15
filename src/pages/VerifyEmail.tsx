import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";

type VerifyStatus = "verifying" | "success" | "error";

interface VerifyResponse {
  success: boolean;
  message: string;
}

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<VerifyStatus>("verifying");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get<VerifyResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/users/verify-email/${token}`
        );
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        const error = err as AxiosError<VerifyResponse>;
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed or link expired."
        );
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif', fontWeight: 400 }}>
            Verifying your email
          </h2>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Please wait a moment...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif', fontWeight: 500 }}>
            Email verified successfully
          </h2>
          <p className="text-sm text-gray-600 mb-8" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            {message}
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm py-3 px-8 rounded-md transition-colors"
            style={{ fontFamily: 'Google Sans, sans-serif', fontWeight: 500 }}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif', fontWeight: 500 }}>
          Verification failed
        </h2>
        <p className="text-sm text-gray-600 mb-8" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          {message}
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm py-3 px-8 rounded-md transition-colors"
          style={{ fontFamily: 'Google Sans, sans-serif', fontWeight: 500 }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default VerifyEmail;