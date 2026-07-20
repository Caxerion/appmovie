module.exports = {
    validateCategoryCreate: (req, res, next) => {
        const {name} = req.body;
        const errors = [];
        if(!name || typeof name !== 'string' || name.trim().length < 2){
            errors.push ('name required (2 characters in minimum)');
        }
        if(errors.length) return res.status(400).json({errors});
        next();
    },

    validateCategoryUpdate: (req, res, next) => {
        const {name} = req.body;
        const errors = [];
        if(!name || typeof name !== 'string' || name.trim().length < 2){
            errors.push ('name required (2 characters in minimum)');
        }
        if(errors.length) return res.status(400).json({errors});
        next();
    },

    validateMovieCreate: (req, res, next) => {
        const {title, year} = req.body;
        const errors = [];
        if(!title || typeof title !== 'string' || title.trim().length < 1) {
            errors.push('title required');
        }
        if(year !== undefined && year !== null && (!Number.isInteger(year) || year < 1800 || year > 2026)) {
            errors.push('year must be valid integer (est. 1800 sd 2026');
        }
        if(errors.length) return res.status(400).json({errors});
        next();
    },

    validateMovieUpdate: (req, res, next) => {
         const {title, year} = req.body;
        const errors = [];
        if(!title || typeof title !== 'string' || title.trim().length < 1) {
            errors.push('title required');
        }
        if(year !== undefined && year !== null && (!Number.isInteger(year) || year < 1800 || year > 2026)) {
            errors.push('year must be valid integer (est. 1800 sd 2026');
        }
        if(errors.length) return res.status(400).json({errors});
        next();
    }
}