import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LearnFloLogo } from "@/components/ui/learn-flo-logo";


interface LandingSectionProps {
  onStudentLogin: () => void
  onTeacherLogin: () => void
}

export function LandingSection({ onStudentLogin, onTeacherLogin }: LandingSectionProps) {
  return (
    <div className="grid gap-3">
      <LearnFloLogo
        height={35}
        width={100}
        className="w-auto mx-auto"
      />

      <div className="grid gap-2">
        <Button className="w-auto mx-auto" onClick={onStudentLogin}>
          Login as a Student
        </Button>

        <p className="text-center font-semibold text-sm text-gray-800">
          OR
        </p>

        <Button className="w-auto mx-auto" onClick={onTeacherLogin}>
          Login as a Teacher
        </Button>
      </div>
    </div>
  )
}

