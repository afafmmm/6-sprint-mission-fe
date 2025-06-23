// src/hooks/useAuthForm.js
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export function useAuthForm(mode = "login") {
  const { login, register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] =
    useState(false);
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const isSignupMode = mode === "signup";

  const validateField = useCallback(
    (name, value) => {
      let errorMsg = "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      switch (name) {
        case "email":
          if (!value) errorMsg = "이메일을 입력해주세요.";
          else if (!emailRegex.test(value))
            errorMsg = "잘못된 이메일 형식입니다.";
          break;
        case "password":
          if (!value) errorMsg = "비밀번호를 입력해주세요.";
          else if (isSignupMode && value.length < 8)
            errorMsg = "비밀번호를 8자 이상 입력해주세요.";
          break;
        case "nickname":
          if (isSignupMode && !value) errorMsg = "닉네임을 입력해주세요.";
          break;
        case "passwordConfirmation":
          if (isSignupMode && !value)
            errorMsg = "비밀번호 확인을 입력해주세요.";
          else if (isSignupMode && password !== value)
            errorMsg = "비밀번호가 일치하지 않습니다.";
          break;
        default:
          break;
      }
      return errorMsg;
    },
    [isSignupMode, password]
  );

  const runValidation = useCallback(() => {
    const currentErrors = {};
    const fieldsToValidate = isSignupMode
      ? ["email", "nickname", "password", "passwordConfirmation"]
      : ["email", "password"];
    const stateValues = { email, password, nickname, passwordConfirmation };

    let allTouchedFieldsValid = true;
    let allFieldsFilled = true;

    fieldsToValidate.forEach((field) => {
      const value = stateValues[field];
      if (!value) {
        allFieldsFilled = false;
      }
      if (touched[field]) {
        const error = validateField(field, value);
        if (error) {
          currentErrors[field] = error;
          allTouchedFieldsValid = false;
        }
      } else {
      }
    });

    setErrors(currentErrors);

    setIsFormValid(allFieldsFilled && allTouchedFieldsValid);
  }, [
    email,
    password,
    nickname,
    passwordConfirmation,
    touched,
    isSignupMode,
    validateField,
  ]);

  useEffect(() => {
    runValidation();
  }, [email, password, nickname, passwordConfirmation, touched, runValidation]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setApiError("");

      if (name === "email") setEmail(value);
      else if (name === "password") setPassword(value);
      else if (isSignupMode && name === "nickname") setNickname(value);
      else if (isSignupMode && name === "passwordConfirmation")
        setPasswordConfirmation(value);

      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      }
    },
    [isSignupMode, touched, validateField]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    },
    [validateField]
  );

  const togglePasswordVisibility = useCallback(
    (fieldId) => {
      if (fieldId === "password") {
        setIsPasswordVisible((prev) => !prev);
      } else if (isSignupMode && fieldId === "passwordConfirmation") {
        setIsPasswordConfirmationVisible((prev) => !prev);
      }
    },
    [isSignupMode]
  );

  const handleCloseErrorModal = useCallback(() => {
    setApiError("");
  }, []);

  const handleCloseSuccessModal = useCallback(() => {
    setSuccessMessage("");
    router.push("/login");
  }, [router]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setApiError("");
      setSuccessMessage("");

      const allFields = isSignupMode
        ? {
            email: true,
            nickname: true,
            password: true,
            passwordConfirmation: true,
          }
        : { email: true, password: true };
      setTouched(allFields);

      const validationErrors = {};
      const fieldsToValidate = isSignupMode
        ? ["email", "nickname", "password", "passwordConfirmation"]
        : ["email", "password"];
      const stateValues = { email, password, nickname, passwordConfirmation };
      let hasErrors = false;
      fieldsToValidate.forEach((field) => {
        const error = validateField(field, stateValues[field]);
        if (error) {
          validationErrors[field] = error;
          hasErrors = true;
        }
      });

      setErrors(validationErrors);

      if (hasErrors) {
        setIsFormValid(false);
        return;
      }

      setIsLoading(true);
      try {
        if (isSignupMode) {
          await register(nickname, email, password, passwordConfirmation);
          setSuccessMessage("회원가입이 성공적으로 완료되었습니다.");
        } else {
          await login(email, password);
        }
      } catch (error) {
        console.error(`${isSignupMode ? "Signup" : "Login"} failed:`, error);
        const message =
          error?.response?.data?.message ||
          error.message ||
          `${isSignupMode ? "회원가입" : "로그인"} 중 오류가 발생했습니다.`;
        setApiError(message);
        setIsFormValid(false);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isSignupMode,
      email,
      password,
      nickname,
      passwordConfirmation,
      login,
      register,
      validateField,
      router,
    ]
  );

  return {
    formState: { email, password, nickname, passwordConfirmation },
    errors,
    apiError,
    successMessage,
    isLoading,
    isPasswordVisible,
    isPasswordConfirmationVisible,
    isFormValid,
    handleInputChange,
    handleBlur,
    handleSubmit,
    togglePasswordVisibility,
    handleCloseErrorModal,
    handleCloseSuccessModal,
    touched,
  };
}
