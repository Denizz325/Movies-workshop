import { Router } from "express";

import movieService from "../services/movieService.js";
import castService from "../services/castService.js";
import { getErrorMessage } from "../utils/errorUtiles.js";

const router = Router();

// URL: /movies/create
router.get('/create', (req, res) => {
    res.render('movies/create');
});

router.post('/create', async (req, res) => {
    const movieData = req.body;
    const ownerId = req.user?._id
    try {

        await movieService.create(movieData, ownerId);
    } catch(err) {
        const errorMsg = getErrorMessage(err)
        return res.render('movies/create', {error: errorMsg, movie: movieData})
    }

    res.redirect('/');
});

router.get('/search', async (req, res) => {
    const filter = req.query;
    const movies = await movieService.getAll(filter).lean();

    res.render('home', { isSearch: true, movies, filter });
});

router.get('/:movieId/details', async (req, res) => {
    const movieId = req.params.movieId;
    const movie = await movieService.getOne(movieId).lean();
    const isOwner = movie.owner && movie.owner.toString() === req.user?._id;
    console.log(isOwner)
    res.render('movies/details', { movie, isOwner });
});

router.get('/:movieId/attach', async (req, res) => {
    const movie = await movieService.getOne(req.params.movieId).lean();
    const casts = await castService.getAllWithout(movie.casts).lean();

    res.render('movies/attach', { movie, casts });
});

router.post('/:movieId/attach', async (req, res) => {
    const movieId = req.params.movieId;
    const castId = req.body.cast;
    const character = req.body.character;

    await movieService.attach(movieId, castId, character);

    res.redirect(`/movies/${movieId}/details`);
});

router.get('/:movieId/delete', async (req, res) => {
    const movieId = req.params.movieId

    const movie = await movieService.getOne(movieId).lean();
    if (movie.owner?.toString() !== req.user._id) {
        // return res.render('movies/details', { movie, isOwner: false, error: 'You cannot delete this movie!' });
        res.setError('You cannot delete this movie!');
        return res.redirect('/404');
    }

    await movieService.remove(movieId)
    res.redirect('/');
});

router.get('/:movieId/edit', async (req, res) => {
    const movieId = req.params.movieId;
    const movie = await movieService.getOne(movieId).lean()
    
    res.render('movies/edit', {movie})
});

router.post('/:movieId/edit', async (req, res) => {
    const data = req.body
    const movieId = req.params.movieId;
    
    await movieService.update(movieId, data)
    
    res.redirect('/')
});
export default router;
