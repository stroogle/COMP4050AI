import { Router } from "express";
import { validate } from "class-validator";
import { QuestionDTO, QuestionRequestDTO } from "./questions.dto";
import {AIService} from "../../services/AIService"

let router = Router();

router.post("/", async (req, res) => {
    let body = new QuestionDTO();

    body.number_of_questions = req.body?.number_of_questions;
    body.file_id = req.body?.file_id;

    let errors = await validate(body)
    
    if(errors.length)
        return res.status(400).send({message: errors});
        
    res.sendStatus(201);

})

router.get("/:file/:question_count", async (req, res) => {
    const valid = new QuestionRequestDTO();

    valid.file = req.params.file;
    valid.question_count = parseInt(req.params.question_count);

    let errors = await validate(valid);

    if(errors.length)
        return res.status(400).send({message: errors});

    const ai = new AIService(process.env.OPENAI_API_KEY as string);

    const answer = await ai.getQuestions(valid.question_count, valid.file).catch(() => false);

    if(!answer)
        return res.status(500).send({message: "Failed to get questions."})

    return res.status(200).send({
        questions: answer
    })
})

export default router;