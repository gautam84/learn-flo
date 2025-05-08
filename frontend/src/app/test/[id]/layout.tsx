// app/quiz/layout.tsx
import type { ReactNode } from "react"

export default function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Take a Test</h1>
        {children}
      </div>
    </main>
  )
}
