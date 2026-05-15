import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(express.json());

// Configuração do Banco de Dados SQLite
const dbPromise = open({
  filename: './database.db',
  driver: sqlite3.Database
});

// Criar a tabela ao iniciar
const db = await dbPromise;
await db.run(`CREATE TABLE IF NOT EXISTS alunos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)`);

// ROTA 1: Buscar todos (Read)
app.get('/alunos', async (req, res) => {
  const alunos = await db.all('SELECT * FROM alunos');
  res.json(alunos);
});

// ROTA 2: Criar novo (Create)
app.post('/alunos', async (req, res) => {
  await db.run('INSERT INTO alunos (nome) VALUES (?)', [req.body.nome]);
  res.sendStatus(201);
});

// ROTA 3: Eliminar (Delete)
app.delete('/alunos/:id', async (req, res) => {
  await db.run('DELETE FROM alunos WHERE id = ?', [req.params.id]);
  res.sendStatus(200);
});

// Servir o HTML simples
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.listen(3000, () => console.log("Servidor em: http://localhost:3000"));