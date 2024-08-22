import { Router } from "express";
import { validate } from "class-validator";
import { QuestionDTO } from "./questions.dto";

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

export default router;