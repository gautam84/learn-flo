import type { ReactNode } from 'react'

export default function CreateTestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="w-full border-b bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a New Test </h1>
          {/* You can add a logout button or profile here */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  )
}
