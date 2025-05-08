"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { mockQuiz } from "@/lib/mock-data"


// Types
type Quiz = {
  id: number
  title: string
  description?: string
  duration: number
  questions: Question[]
}

type Question = {
  id: number
  text: string
  isMcq: boolean
  options: { id: number; text: string }[]
}

type Answer = {
  questionId: number
  selectedOptionId?: number
  writtenAnswer?: string
}

export default function GiveQuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(mockQuiz)
  const [answers, setAnswers] = useState<Answer[]>([])
  const router = useRouter()

  const [timeLeft, setTimeLeft] = useState<number | null>(null)

useEffect(() => {
  if (!quiz) return
  setTimeLeft(quiz.duration * 60) // duration is in minutes
}, [quiz])

useEffect(() => {
  if (timeLeft === null) return

  if (timeLeft === 0) {
    handleSubmit()
    return
  }

  const timer = setTimeout(() => {
    setTimeLeft((prev) => (prev !== null ? prev - 1 : null))
  }, 1000)

  return () => clearTimeout(timer)
}, [timeLeft])

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }
  


  // Fetch quiz data
//   useEffect(() => {
//     const fetchQuiz = async () => {
//       const res = await fetch(`/api/quiz/${params.id}`)
//       const data = await res.json()
//       setQuiz(data)

//       // Pre-fill answer array
//       const defaultAnswers = data.questions.map((q: Question) => ({
//         questionId: q.id,
//       }))
//       setAnswers(defaultAnswers)
//     }
//     fetchQuiz()
//   }, [params.id])

  const handleOptionChange = (questionId: number, optionId: number) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, selectedOptionId: optionId } : a
      )
    )
  }

  const handleTextAnswer = (questionId: number, text: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, writtenAnswer: text } : a
      )
    )
  }

  const handleSubmit = async () => {
    await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({
        quizId: quiz?.id,
        answers,
      }),
      headers: { "Content-Type": "application/json" },
    })

    router.push("/thank-you") // Or result page
  }

  if (!quiz) return <div>Loading quiz...</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">

{timeLeft !== null && (
  <div className="text-center mb-4 text-red-600 font-semibold text-lg">
    Time Remaining: {formatTime(timeLeft)}
  </div>
)}

      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      {quiz.description && <p className="text-muted-foreground">{quiz.description}</p>}
      <p className="text-sm text-gray-500">Duration: {quiz.duration} minutes</p>

      

      {quiz.questions.map((q, index) => (
        <div key={q.id} className="border p-4 rounded-lg space-y-3">
          <h2 className="font-medium">
            Q{index + 1}. {q.text}
          </h2>

          {q.isMcq ? (
            <RadioGroup
              onValueChange={(val) => handleOptionChange(q.id, parseInt(val))}
              value={
                answers.find((a) => a.questionId === q.id)?.selectedOptionId?.toString() || ""
              }
            >
              {q.options.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.id.toString()} id={`${q.id}-${opt.id}`} />
                  <label htmlFor={`${q.id}-${opt.id}`}>{opt.text}</label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              placeholder="Your answer"
              value={answers.find((a) => a.questionId === q.id)?.writtenAnswer || ""}
              onChange={(e) => handleTextAnswer(q.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <Button onClick={handleSubmit}>Submit Test</Button>
    </div>
  )
}
