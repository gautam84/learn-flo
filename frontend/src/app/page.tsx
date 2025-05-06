'use client';
import { LearnFloLogo } from "@/components/ui/learn-flo-logo";

import { LoginForm } from "@/components/login-form"
import { SignUpForm } from "@/components/sign-up-form";
import { LandingSection } from "@/components/landing-section";
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ForgotPasswordForm } from "@/components/forgot-password";
import { useAuth } from "@/lib/contexts/auth-context"



type FormType = "landing" | "studentLoginForm"| "teacherLoginForm" | "studentSignUpForm" | "teacherSignUpForm"| "forgotPassword"

function getFormFromHash(hash: string): FormType {
  const cleanedHash = hash.replace("#", "");
  const validForms: FormType[] = [
    "landing",
    "studentLoginForm",
    "teacherLoginForm",
    "studentSignUpForm",
    "teacherSignUpForm",
    "forgotPassword"
  ];
  return validForms.includes(cleanedHash as FormType) 
    ? (cleanedHash as FormType) 
    : "landing";
}

export default function LandingPage() {
  const [currentForm, setCurrentForm] = useState<FormType>('landing'  );

  const { user } = useAuth();





  // Listen for hash changes (back/forward or manual hash edit)
  useEffect(() => {
    const onHashChange = () => {
      setCurrentForm(getFormFromHash(window.location.hash));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);


  const handleFormChange = (form: FormType) => {
    window.location.hash = form;
  };

  const renderForm = (form: FormType) => {
    switch (form) {
      case "landing":
        return (
          <LandingSection
            onStudentLogin={() => handleFormChange("studentLoginForm")}
            onTeacherLogin={() => handleFormChange("teacherLoginForm")}
          />
        );
      case "studentLoginForm":
        return (
          <LoginForm
           onGoogleLogin={() => console.log("Google Login")}
            onForgotPassword={() => handleFormChange("forgotPassword")}
            callbackUrl="/student/dashboard"

            onSignUp={() => handleFormChange("studentSignUpForm")}
            label="Email or Student ID"
          />
        );
      case "teacherLoginForm":
        return (
          <LoginForm
            onGoogleLogin={() => console.log("Google Login")}
            callbackUrl="/teacher/dashboard"

            onForgotPassword={() => handleFormChange("forgotPassword")}
            onSignUp={() => handleFormChange("teacherSignUpForm")}
            label="Email or Teacher ID"
          />
        );
      case "studentSignUpForm":
        return <SignUpForm
        label="Student ID" />;
      case "teacherSignUpForm":
        return <SignUpForm 
        label="Teacher ID"/>;
      case "forgotPassword":
        return <ForgotPasswordForm />;
      default:
        return  (
          <LandingSection
            onStudentLogin={() => handleFormChange("studentLoginForm")}
            onTeacherLogin={() => handleFormChange("teacherLoginForm")}
          />
        );;
    }
  };

  if (user) {
    // Redirect to the dashboard based on user role
    if (user.role === "STUDENT") {
      window.location.href = "/student/dashboard";
    } else if (user.role === "TEACHER") {
      window.location.href = "/teacher/dashboard";
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium" onClick={() => handleFormChange('landing')}>
           {(currentForm !== 'landing' ) && (
                <LearnFloLogo 
                  height={35}
                  width={100}
                />
            )}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">

          <AnimatePresence mode="wait">
          {currentForm && (
            <motion.div
              key={currentForm}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderForm(currentForm)}
            </motion.div>
          )}
        </AnimatePresence>




   
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/landing-illustration.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
