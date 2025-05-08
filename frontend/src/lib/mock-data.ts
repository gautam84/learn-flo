export type MockQuiz = {
    id: number
    title: string
    description?: string
    duration: number
    questions: {
      id: number
      text: string
      isMcq: boolean
      options: { id: number; text: string }[]
    }[]
  }
  
  export const mockQuiz: MockQuiz = {
    id: 1,
    title: "General Knowledge Test",
    description: "A simple quiz to test your general knowledge.",
    duration: 15,
    questions: [
      {
        id: 101,
        text: "What is the capital of France?",
        isMcq: true,
        options: [
          { id: 1, text: "Berlin" },
          { id: 2, text: "Madrid" },
          { id: 3, text: "Paris" },
          { id: 4, text: "Rome" },
        ],
      },
      {
        id: 102,
        text: "Who wrote 'Hamlet'?",
        isMcq: true,
        options: [
          { id: 5, text: "Charles Dickens" },
          { id: 6, text: "William Shakespeare" },
          { id: 7, text: "Jane Austen" },
          { id: 8, text: "Leo Tolstoy" },
        ],
      },
      {
        id: 103,
        text: "Explain the theory of relativity.",
        isMcq: false,
        options: [],
      },
    ],
  }
  