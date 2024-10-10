import { Router } from "express";
import  authService from "../services/authService.js";
import { getErrorMessage } from "../utils/errorUtiles.js";


const router = Router();

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async(req, res) => {
    const {email, password, rePassword} = req.body

    try {

        await authService.register(email, password, rePassword);
    } catch(err) {
        return res.render('auth/register', { error: getErrorMessage(err), email})
    }

    const token = await authService.login(email, password)
    res.cookie('auth', token, {httpOnly: true})
    
    res.redirect('/')
    


});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {

    const {email, password} = req.body
    let token = ''
    try{
        token = await authService.login(email, password)
        console.log(token)
    } catch(err) {
        return res.render('auth/login', { error: getErrorMessage(err), email})
    }

    res.cookie('auth', token, {httpOnly: true})
    
    res.redirect('/')

});

router.get('/logout', (req, res) => {
    res.clearCookie('auth')
    res.redirect('/')
});


export default router;