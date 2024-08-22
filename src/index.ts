import express from "express";
// import question_routes  from "routes/question_routes";
import question_routes from "./routes/questions"

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
    res.sendStatus(200);
})

app.use("/questions", question_routes);

app.listen(8000);