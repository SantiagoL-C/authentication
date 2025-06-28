import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './connection';

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    const { nombre, correo, contrasena, user_type } = req.body;

    try {
        // @ts-ignore
        const [rows] = await pool.query(
            'SELECT idUsuarios FROM usuarios WHERE correo = ? LIMIT 1',
            [correo]
        );

        if ((rows as any[]).length > 0) {
            return res.status(409).json({ error: 'Correo ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        // @ts-ignore
        await pool.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, user_type) VALUES (?, ?, ?, ?)',
            [nombre, correo, hashedPassword, user_type]
        );

        res.status(201).json({ message: 'Usuario registrado' });
    } catch (error) {
        console.error('❌ Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});


// Login
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // @ts-ignore
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        const usuarios: any[] = rows as any[];

        if (usuarios.length === 0) {
            return res.status(401).send('Usuario no encontrado');
        }

        const usuario = usuarios[0];
        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!validPassword) {
            return res.status(401).send('Contraseña incorrecta');
        }

        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo },
            'secreto',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            id: usuario.id,
            correo: usuario.correo,
            user_type: usuario.user_type
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send('Error en el servidor');
    }
});

export default router;
