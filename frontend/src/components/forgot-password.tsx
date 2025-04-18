import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">

          <div className="flex flex-col items-center gap-2">
          
            <h1 className="text-xl font-bold">Forgot Password?</h1>
            <div className="text-center text-sm">
            Enter your email or Student ID / Teacher ID and we'll send you a link to get back into your account.{" "}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="text">Email or Student ID / Teacher ID</Label>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Link
            </Button>
          </div>
        
     
        </div>
      </form>
      
    </div>
  )
}
