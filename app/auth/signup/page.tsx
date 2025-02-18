import { AuthForm } from "@/components/AuthForm"

export default function SignUp() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <AuthForm mode="signup" />
    </div>
  )
}

