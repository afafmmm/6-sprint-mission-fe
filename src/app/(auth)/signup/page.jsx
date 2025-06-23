// /home/jisu/sprint8/src/app/(auth)/signup/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import CommonModal from "@/components/CommonModal";
import AuthInput from "@/components/AuthInput";
import AuthLogo from "@/components/auth/AuthLogo"; // 새 컴포넌트
import SocialLoginButtons from "@/components/auth/SocialLoginButtons"; // 새 컴포넌트
import AuthPageLink from "@/components/auth/AuthPageLink"; // 새 컴포넌트

export default function SignUpPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [touched, setTouched] = useState({});

  const router = useRouter();

  useEffect(() => {
    const validate = () => {
      const currentErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (touched.email) {
        if (!email) currentErrors.email = "이메일을 입력해주세요.";
        else if (!emailRegex.test(email))
          currentErrors.email = "잘못된 이메일 형식입니다.";
      }
      if (touched.nickname) {
        if (!nickname) currentErrors.nickname = "닉네임을 입력해주세요.";
      }
      if (touched.password) {
        if (!password) currentErrors.password = "비밀번호를 입력해주세요.";
        else if (password.length < 8)
          currentErrors.password = "비밀번호를 8자 이상 입력해주세요.";
      }
      if (touched.passwordConfirmation) {
        if (!passwordConfirmation)
          currentErrors.passwordConfirmation = "비밀번호 확인을 입력해주세요.";
        else if (password !== passwordConfirmation)
          currentErrors.passwordConfirmation = "비밀번호가 일치하지 않습니다.";
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        ...currentErrors,
      }));

      const allFieldsFilled =
        !!email && !!nickname && !!password && !!passwordConfirmation;
      const hasValidationErrors = Object.values(currentErrors).some(
        (error) => !!error
      );

      setIsFormValid(allFieldsFilled && !hasValidationErrors);
    };
    validate();
  }, [email, nickname, password, passwordConfirmation, touched]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    let currentErrors = { ...errors };

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) errorMsg = "이메일을 입력해주세요.";
        else if (!emailRegex.test(value))
          errorMsg = "잘못된 이메일 형식입니다.";
        break;
      case "nickname":
        if (!value) errorMsg = "닉네임을 입력해주세요.";
        break;
      case "password":
        if (!value) errorMsg = "비밀번호를 입력해주세요.";
        else if (value.length < 8)
          errorMsg = "비밀번호를 8자 이상 입력해주세요.";
        if (touched.passwordConfirmation) {
          if (!passwordConfirmation) {
            currentErrors.passwordConfirmation =
              "비밀번호 확인을 입력해주세요.";
          } else if (value !== passwordConfirmation) {
            currentErrors.passwordConfirmation =
              "비밀번호가 일치하지 않습니다.";
          } else {
            currentErrors.passwordConfirmation = "";
          }
        }
        break;
      case "passwordConfirmation":
        if (!value) errorMsg = "비밀번호 확인을 입력해주세요.";
        else if (password !== value) errorMsg = "비밀번호가 일치하지 않습니다.";
        break;
      default:
        break;
    }
    currentErrors[name] = errorMsg;
    setErrors(currentErrors);
    return errorMsg;
  };

  const togglePasswordVisibility = (fieldId) => {
    if (fieldId === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (fieldId === "passwordConfirmation") {
      setPasswordConfirmationVisible(!passwordConfirmationVisible);
    }
  };

  const handleCloseErrorModal = () => {
    setApiError("");
  };

  const handleCloseSuccessModal = () => {
    setSuccessMessage("");
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    setTouched({
      email: true,
      nickname: true,
      password: true,
      passwordConfirmation: true,
    });

    const validationErrors = {
      email: validateField("email", email),
      nickname: validateField("nickname", nickname),
      password: validateField("password", password),
      passwordConfirmation: validateField(
        "passwordConfirmation",
        passwordConfirmation
      ),
    };

    const hasErrors = Object.values(validationErrors).some((error) => !!error);

    if (hasErrors) {
      setIsFormValid(false);
      return;
    }

    setIsFormValid(true);
    setIsLoading(true);

    try {
      await register(nickname, email, password, passwordConfirmation);
      setSuccessMessage("회원가입이 성공적으로 완료되었습니다.");
    } catch (error) {
      console.error("Signup failed:", error);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "회원가입 중 오류가 발생했습니다.";
      setApiError(message);
      setIsFormValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const hasInputErrors = Object.values(errors).some((error) => !!error);
    const allFieldsFilled =
      !!email && !!nickname && !!password && !!passwordConfirmation;
    setIsFormValid(allFieldsFilled && !hasInputErrors);
  }, [email, nickname, password, passwordConfirmation, errors]);

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen bg-white p-4 pt-16 sm:pt-10">
      <AuthLogo />
      <div className="flex flex-col items-center gap-6 w-full max-w-[640px] mt-10">
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-6"
          >
            <AuthInput
              id="email"
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleBlur}
              placeholder="이메일을 입력해주세요"
              error={touched.email ? errors.email : ""}
            />
            <AuthInput
              id="nickname"
              label="닉네임"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={handleBlur}
              placeholder="닉네임을 입력해주세요"
              error={touched.nickname ? errors.nickname : ""}
            />
            <AuthInput
              id="password"
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handleBlur}
              placeholder="비밀번호를 입력해주세요"
              error={touched.password ? errors.password : ""}
              isPasswordVisible={passwordVisible}
              togglePasswordVisibility={togglePasswordVisibility}
            />
            <AuthInput
              id="passwordConfirmation"
              label="비밀번호 확인"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              onBlur={handleBlur}
              placeholder="비밀번호를 다시 한 번 입력해주세요"
              error={
                touched.passwordConfirmation ? errors.passwordConfirmation : ""
              }
              isPasswordVisible={passwordConfirmationVisible}
              togglePasswordVisibility={togglePasswordVisibility}
            />

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full h-14 rounded-full border-none text-xl font-semibold leading-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isFormValid && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-400 text-gray-100 cursor-not-allowed"
              }`}
            >
              {isLoading ? "회원가입 중..." : "회원가입"}
            </button>
          </form>
        </div>

        <SocialLoginButtons />

        <AuthPageLink
          text="이미 회원이신가요?"
          link="/login"
          linkText="로그인"
        />
      </div>

      <CommonModal
        isOpen={!!apiError}
        onClose={handleCloseErrorModal}
        message={apiError}
        type="error"
      />
      <CommonModal
        isOpen={!!successMessage}
        onClose={handleCloseSuccessModal}
        message={successMessage}
        type="success"
      />
    </div>
  );
}
