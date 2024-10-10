import { Router } from "express";
import castService from "../services/castService.js";
import { getErrorMessage } from "../utils/errorUtiles.js";

const router = Router();

router.get('/create', (req, res) => {
    res.render('cast/create');
});

router.post('/create', async (req, res) => {
    const cast = req.body;

    try {

        await castService.create(cast);
    } catch(err) {
        return res.render('cast/create', {error: getErrorMessage(err), cast})
    }

    res.redirect('/');
});

export default router;
