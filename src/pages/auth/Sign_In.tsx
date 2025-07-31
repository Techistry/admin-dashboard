import { Typography, TextField, InputAdornment, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import Toast from "../../utils/Toast";
import Auth from "../../container/Auth";
import api from "../../utils/axiosInstance";
import DynamicTitle from "../../utils/DynamicTitle";

interface LoginDetails {
  email: string;
  password: string;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "error" | "warning";
}

const Sign_In = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  const [loginDetails, setDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  });

  const [redirectAfterToast, setRedirectAfterToast] = useState<string | null>(
    null
  );

  const showToast = (message: string, severity: ToastState["severity"]) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
    setLoading(false);

    if (redirectAfterToast) {
      navigate(redirectAfterToast);
      setRedirectAfterToast(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const isFormDataComplete = () => {
    return Object.values(loginDetails).every((value) => value.trim() !== "");
  };

  const submit = async () => {
    setLoading(true);
    const formReady = isFormDataComplete();

    if (!formReady) {
      setLoading(false);
      showToast("Please input all fields", "warning");
      return;
    }
    try {
      const response = await api.post("/api/admin/login", loginDetails);

      if (response.data) {
        setLoading(false);
        showToast(response.data.message, "success");
        setRedirectAfterToast("/dashboard");

        // localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("adminData", JSON.stringify(response.data.data));
        return;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      showToast(error.response.data.message, "error");

      return;
    }
  };

  return (
    <Auth>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />

      <DynamicTitle title="Encore AI - Login" />

      <div className="flex justify-center items-center h-[90vh]">
        <div className="bg-[white] w-[602px] h-[484px] gap-[40px] flex flex-col p-[40px]">
          <div className="flex flex-col gap-[12px]">
            <Typography
              fontWeight={500}
              fontSize={24}
              sx={{ color: "#475367", fontFamily: "Open Sans, sans-serif" }}
            >
              Sign In
            </Typography>
            <Typography
              fontWeight={500}
              sx={{ fontFamily: "Open Sans, sans-serif" }}
              fontSize={36}
            >
              Welcome Back!
            </Typography>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[12px]">
              <Typography
                fontWeight={400}
                fontSize={14}
                sx={{
                  color: isEmailFocused ? "#0167C4" : "black",
                  fontFamily: "Open Sans, sans-serif",
                }}
              >
                Email address
              </Typography>

              <TextField
                placeholder="Enter email address"
                name="email"
                value={loginDetails.email}
                onChange={handleChange}
                type="text"
                size="small"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                sx={{
                  width: "444px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </div>

            <div className="flex flex-col gap-[12px]">
              <Typography
                fontWeight={400}
                sx={{
                  color: isPasswordFocused ? "#0167C4" : "black",
                  fontFamily: "Open Sans, sans-serif",
                }}
                fontSize={14}
              >
                Password
              </Typography>
              <TextField
                placeholder="Enter password"
                name="password"
                onChange={handleChange}
                value={loginDetails.password}
                type={showPassword ? "text" : "password"}
                size="small"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                fullWidth
                sx={{
                  width: "444px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {showPassword ? (
                        <VscEye
                          size={20}
                          className="text-[#A0AAB2] cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <VscEyeClosed
                          size={20}
                          className="text-[#A0AAB2] cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="bg-[#F0EEFF] py-[8px] px-[12px] rounded-[12px] w-[125px]">
              <Typography
                fontWeight={400}
                sx={{ color: "#1D2739", fontFamily: "Open Sans, sans-serif" }}
                fontSize={12}
                color="#755AE2"
                onClick={() => navigate("/forgot-password")}
                className="cursor-pointer hover:underline"
              >
                Forgot password?
              </Typography>
            </div>

            <Button
              disabled={loading}
              onClick={submit}
              variant="contained"
              disableElevation
              sx={{
                padding: "16px",
                width: "444px",
                borderRadius: "12px",
                backgroundColor: "black",
                textTransform: "capitalize",
                fontFamily: "Open Sans, sans-serif",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </Auth>
  );
};

export default Sign_In;
