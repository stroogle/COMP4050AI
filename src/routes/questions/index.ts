import { Router } from "express";

let router = Router();

router.get("/", (req, res, next) => {
    res.sendStatus(201);
})

export default router;