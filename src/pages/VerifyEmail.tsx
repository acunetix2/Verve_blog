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
          `${import.meta.env.VITE_API_BASE_URL}/verify-email/${token}`
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
    return <h2>🔄 Verifying your email...</h2>;
  }

  if (status === "success") {
    return (
      <div>
        <h2>✅ Email Verified</h2>
        <p>{message}</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div>
      <h2>❌ Verification Failed</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
