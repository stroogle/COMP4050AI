import express from "express";
import * as dotenv from "dotenv";
import question_routes from "./routes/questions"

dotenv.config();

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
    res.sendStatus(200);
})

app.use("/questions", question_routes);

app.listen(8000);