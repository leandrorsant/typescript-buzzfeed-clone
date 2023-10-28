import React, { useState, useEffect } from 'react';
import Title from './components/Title';
import { Content, QuizData } from '../interfaces'
import QuestionsBlock from './components/QuestionsBlock'

function App() {
  const [quiz, setQuiz] = useState<QuizData|null>(null)


  const fetchData = async () => {
    try{
      const response = await fetch('http://localhost:8000/quiz-item')
      const json = await response.json()
      setQuiz(json)
      
    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    fetchData();
  },[]);

  console.log(quiz)

  return (
    <div>
      <Title title={quiz?.title} subtitle={quiz?.subtitle} />
      {quiz?.content.map((content: Content, id: Content['id'])=>(
        <QuestionsBlock
          key={id} 
          quizItem={content}
        />
      ))}
      
    </div>
  );
}

export default App;
