'use client'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function Quiz() {
  interface QuizItem {
    id: string;
    questions: string;
    answer: boolean;
  }
  
  const [question, setQuestion] = useState<string>("")
  const [newAnswer, setNewAnswer] = useState<string>("") // For adding new questions
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({}) // For storing user answers
  const [quiz, setQuiz] = useState<QuizItem[]>([])
  const [result, setResult] = useState<{[key: string]: string}>({}) // For storing results
  const [point, setPoint] = useState<number>(0)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (!newAnswer) {
      alert('Please select an answer');
      return;
    }

    const { error } = await supabase.from('quiz').insert({
      questions: question,
      answer: newAnswer === 'true' // Convert string to boolean
    });

    if (error) {
      console.error('Error inserting data:', error);
      alert('Failed to save question');
      return;
    }
    
    setQuestion("");
    setNewAnswer("");
    refetch(); // Refresh the list after adding
  }

  const refetch = async () => {
    const { data, error } = await supabase.from('quiz').select()
    if (error) {
      console.error('Error fetching data:', error);
      return;
    }
    setQuiz(data || []);
  }

  useEffect(() => {
    refetch();
  }, []);

  const handleAnswerChange = (id: string, value: string) => {
    setUserAnswers(prev => ({...prev, [id]: value}));
  }

  const handleCheck = async (id: string) => {
    const { data, error } = await supabase
      .from('quiz')
      .select('answer')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching data:', error);
      return;
    }
    
    const isCorrect = data.answer === (userAnswers[id] === 'true');
    
    setResult(prev => ({...prev, [id]: isCorrect ? 'Correct! ✅' : 'Wrong! ❌'}));
    if(isCorrect){
      setPoint(prev => prev + 1)
    }
    
    // Clear the result after 2 seconds
    setTimeout(() => {
      setResult(prev => {
        const newResult = {...prev};
        delete newResult[id];
        return newResult;
      });
    }, 2000);
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-8">
      <Card className="w-[90%] max-w-2xl mx-auto p-6 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Add New Quiz Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={question}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
            type="text"
            placeholder="Enter your question"
            className="text-lg p-3"
          />
          <div>
            <label className="block mb-2 font-medium">Correct Answer:</label>
            <select
              value={newAnswer}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewAnswer(e.target.value)}
              className="w-full p-2 border rounded-md text-lg"
            >
              <option value="">Select an answer</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-2">
            Add Quiz Question
          </Button>
        </form>
      </Card>

      <Card className="w-[90%] max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Quiz Questions</h2>
        {quiz.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No quiz questions yet. Add some above!</p>
        ) : (
          <ul className="space-y-4">
            {quiz.map((item) => (
              <li key={item.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg mb-2 flex-1">{item.questions}</h3>
                  
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={userAnswers[item.id] || ""}
                    onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                    className="p-2 border rounded-md flex-1"
                  >
                    <option value="">Select your answer</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <Button 
                    onClick={() => handleCheck(item.id)}
                    disabled={!userAnswers[item.id]}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Check Answer
                  </Button>
                </div>
                {result[item.id] && (
                  <div className={`mt-2 p-2 rounded-md text-center font-semibold ${
                    result[item.id].includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result[item.id]}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <p className="text-center text-lg font-bold mt-6">Points: {point}</p>
    </div>
  )
}