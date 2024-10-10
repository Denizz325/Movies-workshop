import { Schema, model, Types } from 'mongoose';

const movieSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Movie Title is required!'],
        minLength: 5,
        validate: [/^[A-Za-z0-9 ]+$/, 'Title can contain only alpha numeric characters!'],
    },
    genre: {
        type: String,
        required: true,
        minLength: 5,
        lowercase: true,
        validate: [/^[A-Za-z0-9 ]+$/, 'Genre can contain only alpha numeric characters!'],
    },
    director: {
        type: String,
        minLength: 5,
        validate: [/^[A-Za-z0-9 ]+$/, 'Director can contain only alpha numeric characters!'],
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: [1900, 'Cannot add movies older than 1900 year!'],
        max: [2050, 'Cannot add movies after 2050!'],
    },
    rating: {
        type: Number,
        validate: {
            validator: function (value) {
                if (this.year >= 2000) {
                    return !!value;
                }

                return true;
            },
            message: 'Rating is required for movies after 2000 year',
        },
        min: [1, 'Rating should be at least 1!'],
        max: [5, 'Rating cannot be higher than 5!'],
    },
    description: {
        type: String,
        required: true,
        validate: [/^[A-Za-z0-9 ]+$/, 'Description can contain only alpha numeric characters!'],
        minLength: [20, 'Description should be at least 20 characters long!']
    },
    imageUrl: {
        type: String,
        validate: [/^https?:\/\//, 'Invalid image url!'],
    },
    casts: [{
        character: {
            type: String,
            minLength: 5,
            validate: [/^[A-Za-z0-9 ]+$/, 'Character can contain only alpha numeric characters!'],
        },
        cast: {
            type: Types.ObjectId,
            ref: 'Cast'
        },
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    }
});

const Movie = model('Movie', movieSchema);

export default Movie;
