import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect } from "next/navigation"
import { useActionState, useState } from "react"
import  {authService}  from "@/lib/api/auth"
import { useAuth } from "@/lib/contexts/auth-context"

interface LoginFormProps extends React.ComponentProps<"form"> {
  onGoogleLogin: () => void
  onForgotPassword: () => void
  onSignUp: () => void
  callbackUrl: string
  label: string
}

export function LoginForm({
  className,
  onGoogleLogin,
  onForgotPassword,
  onSignUp,
  callbackUrl,
  label = "Email or Student ID",
  ...formProps
}: LoginFormProps) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
    const { login } = useAuth();
  

  const handleSubmit = async (_: any, __: FormData) : Promise<string | undefined> => {


    if (!email || !password) {
      return "Email and password are required";
    }

    const response = await authService.login({
      email,
      password,
    })

    if (response.success) {


      redirect(callbackUrl)

  
    
   
    } else {
      return response.error || "Invalid email or password";
    }
  };

  const [errorMessage, formAction, isPending] = useActionState(
    handleSubmit,
    undefined,
  );



  
  return (
    <form action={formAction} className={cn("flex flex-col gap-6", className)} {...formProps}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your info below to login to your account
        </p>
      </div>
      
      {errorMessage && 
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {errorMessage}
        </div>
      }
      
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="text">{label}</Label>
          <Input id="email"
           name="email"
           value={email}
           onChange={(e) => setEmail(e.target.value ?? "")}
           
          type="text"
          placeholder="me@example.com or john_doe123"
          required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onForgotPassword();
              }}
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password"    value={password}
          onChange={(e) => setPassword(e.target.value) ?? ""} required />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button 
          variant="outline" 
          type="button" 
          className="w-full" 
          onClick={onGoogleLogin}
          disabled={isPending}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20px" height="20px" className="mr-2">
            <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z" />
          </svg>
          Log in with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4" onClick={(e) => {
          e.preventDefault();
          onSignUp();
        }}>
          Sign up
        </a>
      </div>
    </form>
  )
}
