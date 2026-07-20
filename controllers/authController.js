const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
if(!jwtSecret) throw new Error('JWT_SECRET belum diset');

const SALT_ROUNDS = 10 //bcrypt salt rounds

module.exports = {
    register : async (req, res, next) => {
        try{
            const {email, password, name} = req.body;

            //validasi sederehana
            if(!email || !password) return res.status(400).json({message: 'email and password required'});
            if(password.length < 6) return res.status(400).json({message: 'Password 6 characters in minimum'});

            //cek apakah user ada
            const[existing] = await pool.execute('SELECT id FROM users WHERE email = ?',[email]);
            if(existing.length > 0){
                return res.status(409).json({message: 'Email registered'});
            }

            //hashing
            const hashed = await bcrypt.hash(password, SALT_ROUNDS);
            
            //insert user ke database
            const [result] = await pool.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', 
            [email, hashed, name || null]);

            const insertedId = result.insertId;
            return res.status(201).json({ id : insertedId, email, name: name || null});

        }catch(err){
            next(err);
        }
    },

    login: async (req, res, next) => {
        try{
            const {email, password} = req.body;
            if(!email || !password) return res.status(400).json({message: 'email and password required'});

            const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?',[email]);
            if(rows.length === 0) return res.status(401).json({message: 'Invalid Credentials'});
            
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if(!match) return res.status(401).json({message: 'Invalid Credentials'});

            const payload = {id: user.id, email: user.email};
            const token = jwt.sign(payload, jwtSecret, {expiresIn: '1h'});

            return res.json({
                message: 'Sucessfully logged in',
                token,
                user: {id: user.id, email:user.email, name:user.name}
            });
        }catch(err){
            next(err);
        }
    },

    forgotPassword: async (req, res, next) => {
        try{
            const {email, password} = req.body;
            if(!email || !password) return res.status(400).json({message: 'email and password required'});
            if(password.length < 6) return res.status(400).json({message: 'Password 6 characters in minimum'});

            const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?',[email]);
            if(rows.length === 0) return res.status(404).json({message: 'Email not found'});

            const hashed = await bcrypt.hash(password, SALT_ROUNDS);
            await pool.execute('UPDATE users SET password = ? WHERE email = ?',[hashed, email]);

            return res.json({message: 'Password updated successfully'});
        }catch(err){
            next(err);
        }
    }
}