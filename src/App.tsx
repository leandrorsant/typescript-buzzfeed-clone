import React, { useState, useEffect,createRef } from 'react';
import Title from './components/Title';
import { Content, QuizData } from '../interfaces'
import QuestionsBlock from './components/QuestionsBlock'


import AnswerBlock from './components/AnswerBlock';

function App() {
  const [quiz, setQuiz] = useState<QuizData|null>(null)
  const [chosenAnswerItems, setChosenAnswerItems] = useState<string[]>([])
  const [ unansweredQuestionIds, setUnansweredQuestionIds] = useState<number[] | undefined>([])
  const [showAnswer, setShowAnswer] = useState<boolean>(false)

  type ReduceType = {
    id?: {}
  }

  const refs = unansweredQuestionIds?.reduce<ReduceType | any>((acc, id)=> {
    acc[id as unknown as keyof ReduceType] = createRef<HTMLDivElement | null>()
    return acc
  },{})

  const answerRef = createRef<HTMLDivElement | any>()

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

  useEffect(() => {
    
      const unansweredIds = quiz?.content?.map(({id} : Content) => id)
      setUnansweredQuestionIds(unansweredIds)
    
}, [quiz])

  useEffect(()=>{
    if(chosenAnswerItems.length > 0 && unansweredQuestionIds){
      if(showAnswer && answerRef.current){
        answerRef.current.scrollIntoView({behavior:'smooth'})
      }

      if (unansweredQuestionIds.length <= 0 && chosenAnswerItems.length >= 1) {
        setShowAnswer(true)
        const answerBlock = document.getElementById('answer-block')
        answerBlock?.scrollIntoView({behavior:'smooth'})
    }else{
      const highestId = Math.min(...unansweredQuestionIds)
      refs[highestId].current.scrollIntoView({behavior:'smooth'})
    }

      
    }
  },[unansweredQuestionIds,chosenAnswerItems.length, answerRef.current, refs])

  console.log(unansweredQuestionIds)

  return (
    <div className='app'>
      <Title title={quiz?.title} subtitle={quiz?.subtitle} />
      {refs && quiz?.content.map((content: Content, id: Content['id'])=>(
        <QuestionsBlock 
          key={content.id}
          quizItem={content}
          chosenAnswerItems={chosenAnswerItems}
          setChosenAnswerItems={setChosenAnswerItems}
          unansweredQuestionIds={unansweredQuestionIds}
          setUnansweredQuestionIds={setUnansweredQuestionIds}
          ref={refs[content.id]}
                
        />
        
      ))}
      {showAnswer && 
      <AnswerBlock 
        answerOptions={quiz?.answers} 
        chosenAnswers={chosenAnswerItems} 
        ref={answerRef} 
        />}
    </div>
  );
}

export default App;
