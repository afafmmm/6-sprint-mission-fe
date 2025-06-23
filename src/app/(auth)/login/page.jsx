// /home/jisu/sprint8/src/app/(auth)/login/page.jsx
"use client";

import CommonModal from "@/components/CommonModal";
import AuthInput from "@/components/AuthInput";
import AuthLogo from "@/components/auth/AuthLogo";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import AuthPageLink from "@/components/auth/AuthPageLink";
import { useAuthForm } from "@/hooks/useAuthForm"; // 커스텀 훅 임포트

export default function LoginPage() {
  const {
    formState,
    errors,
    apiError,
    isLoading,
    isPasswordVisible,
    isFormValid,
    handleInputChange,
    handleBlur,
    handleSubmit,
    togglePasswordVisibility,
    handleCloseErrorModal,
    touched,
  } = useAuthForm("login"); // 훅 사용 ('login' 모드)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-col items-center gap-10 w-full max-w-[640px]">
        <AuthLogo />

        <div className="flex flex-col items-center gap-6 w-full">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-6 w-full"
          >
            <AuthInput
              id="email"
              label="이메일"
              type="email"
              value={formState.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="이메일을 입력해주세요"
              error={touched.email ? errors.email : ""}
              apiError={apiError} // Pass apiError for potential styling in AuthInput
            />

            <AuthInput
              id="password"
              label="비밀번호"
              type="password"
              value={formState.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="비밀번호를 입력해주세요"
              error={touched.password ? errors.password : ""}
              isPasswordVisible={isPasswordVisible}
              togglePasswordVisibility={togglePasswordVisibility}
              apiError={apiError} // Pass apiError for potential styling in AuthInput
            />

            <div>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full h-14 rounded-full border-none text-xl font-semibold leading-8 ${
                  isFormValid && !isLoading
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-400 text-gray-100 cursor-not-allowed"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </form>

          <SocialLoginButtons />

          <AuthPageLink
            text="판다마켓이 처음이신가요?"
            link="/signup"
            linkText="회원가입"
          />
        </div>
      </div>

      <CommonModal
        isOpen={!!apiError}
        onClose={handleCloseErrorModal}
        message={apiError}
        type="error"
      />
    </div>
  );
}
