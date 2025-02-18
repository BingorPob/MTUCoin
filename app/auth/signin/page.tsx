import { AuthForm } from "@/components/AuthForm"

export default function SignIn() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <AuthForm mode="signin" />
    </div>
  )
}

