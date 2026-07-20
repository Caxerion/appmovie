const pool = require('../config/db');

module.exports = {
//READ
getAll: async(req, res, next) => {
    try{
        const [rows] = await pool.execute(
            'SELECT m.*, name AS categoryName FROM movies m LEFT JOIN categories c ON m.categoryId = c.id ORDER BY m.id DESC');
            res.json(rows);
        res.json(rows);
    }catch(err) {next(err)}
},

//READ by id
getById : async(req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);

       const [rows] = await pool.execute(
        'SELECT m.*, name AS categoryName FROM movies m LEFT JOIN categories c ON m.categoryId = c.id where m.id = ?',[id]);
        
        if(rows.length === 0) return res.status(404).json({message: 'Movie not found'});
        res.json(rows[0]);
    }catch(err) {next(err)}
},

//INSERT/CREATE
create: async(req, res, next) => {
    try{
        const {title, year, categoryId} = req.body;
        const userId = req.user ? req.user.id : null;

        const [result] = await pool.execute(
            'INSERT INTO movies (title, year, categoryId, userId) VALUES (?, ?, ?, ?)',
            [title, year || null, categoryId || null, userId]
        )
        res.status(201).json({id: result.insertId, title, year : year || null, categoryId : categoryId || null});
    }catch(err) {next(err)}
},

update : async (req, res, next) => {
    try{
        const id = parseInt(req.params.id,10);
        const{title, year, categoryId} = req.body;

        const fields = [];
        const values = [];

        if(title !== undefined) {fields.push('title=?'); values.push(title);}
        if(year !== undefined) {fields.push('year = ?'); values.push(year);}
        if(categoryId !== undefined) {fields.push('categoryId=?'); values.push(categoryId);}

        if(fields.length===0) return res.status(400).json({message: 'Nothing to update'});
        values.push(id);
        const sql = `UPDATE movies SET ${fields.join(',')} WHERE id = ?`;
        const [result] = await pool.execute(sql,values);

        if(result.affectedRows === 0) return res.status(404).json({message: 'Movie not found'});
        res.json({message: 'Movie updated successfully'});
    }catch(err) {next(err)}
},

//delete protected
remove : async (req, res, next) => {
    try{
        const id = parseInt(req.params.id,10);
        const [result] = await pool.execute('DELETE FROM movies WHERE id = ?', [id]);
        if(result.affectedRows === 0) return res.status(404).json({message: 'Movie not found'});
        res.json({message: 'Movie deleted successfully'});
    }catch(err) {next(err)}
},      

}