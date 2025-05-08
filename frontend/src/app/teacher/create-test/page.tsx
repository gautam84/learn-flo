'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

type Question = {
  text: string
  isMcq: boolean
  options: string[]
  answer: string
}

export default function CreateTestPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [type, setType] = useState('MCQ')
  const [questions, setQuestions] = useState<Question[]>([])

  const addQuestion = () => {
    setQuestions([...questions, { text: '', isMcq: true, options: [''], answer: '' }])
  }

  const updateQuestion = <K extends keyof Question>(index: number, key: K, value: Question[K]) => {
    const newQuestions = [...questions]
    newQuestions[index][key] = value
    setQuestions(newQuestions)
  }
  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options[optIndex] = value
    setQuestions(newQuestions)
  }

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options.push('')
    setQuestions(newQuestions)
  }

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      duration: parseInt(duration),
      type,
      questions,
    }

    const res = await fetch('/api/quiz/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      alert('Test created successfully!')
    } else {
      alert('Failed to create test.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* <h1 className="text-2xl font-bold">Create a New Test</h1> */}

      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Duration (minutes)</Label>
        <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select onValueChange={(val) => setType(val)} defaultValue="MCQ">
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MCQ">MCQ</SelectItem>
            <SelectItem value="WRITTEN">WRITTEN</SelectItem>
            <SelectItem value="MIXED">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        {questions.map((q, qIndex) => (
          <Card key={qIndex}>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-1">
                <Label>Question Text</Label>
                <Textarea
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={q.isMcq}
                  onCheckedChange={(val) => updateQuestion(qIndex, 'isMcq', val)}
                />
                <Label>{q.isMcq ? 'MCQ' : 'Written'}</Label>
              </div>

              {q.isMcq && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {q.options.map((opt, optIndex) => (
                    <Input
                      key={optIndex}
                      value={opt}
                      placeholder={`Option ${optIndex + 1}`}
                      onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    />
                  ))}
                  <Button variant="outline" onClick={() => addOption(qIndex)}>
                    + Add Option
                  </Button>
                </div>
              )}

              <div className="space-y-1">
                <Label>Correct Answer</Label>
                <Input
                  value={q.answer}
                  onChange={(e) => updateQuestion(qIndex, 'answer', e.target.value)}
                  placeholder={q.isMcq ? 'Enter correct option text' : 'Enter correct written answer'}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addQuestion}>+ Add Question</Button>
      </div>

      <Button className="w-full" onClick={handleSubmit}>
        Create Test
      </Button>
    </div>
  )
}
