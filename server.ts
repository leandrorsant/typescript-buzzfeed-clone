import axios, { AxiosResponse } from 'axios';
import express, { Request, Response } from 'express'
import * as dotenv from "dotenv";

import { QuizData } from './interfaces'

dotenv.config();

const PORT = 8000;
const app = express()

app.get("/quiz-item", async (req: Request, res: Response) => {
    try {
        const response: AxiosResponse = await axios.get("https://b5eb6012-41b2-4b79-9166-8ec263c3c040-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/quizes/collections/quirky_quizes?page-size=3",{
            headers: {
                'X-Cassandra-Token': process.env.TOKEN,
                accept: 'application/json'
            }
        })

        if(response.status === 200){
            const quizItem : QuizData = await response.data.data['48f22b37-219c-4ae9-ad34-a59c44ab5744']
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send(quizItem)
        }
    }catch(error){
        console.error(error)
    }
})

app.listen(PORT, () => console.log('server is running on port '+PORT))