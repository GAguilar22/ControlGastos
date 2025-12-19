import express from 'express';
import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de rutas para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de LowDB
// Se define la estructura inicial por defecto: { expenses: [] }
const defaultData = { expenses: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Middleware para procesar JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Rutas de la API ---

// GET /api/expenses - Obtener todos los gastos
app.get('/api/expenses', async (req, res) => {
    await db.read(); // Asegurarse de tener los datos más recientes
    res.json(db.data.expenses);
});

// POST /api/expenses - Crear un nuevo gasto
app.post('/api/expenses', async (req, res) => {
    const { concept, amount, date } = req.body;

    if (!concept || !amount || !date) {
        return res.status(400).json({ error: 'Faltan datos requeridos (concepto, cantidad o fecha)' });
    }

    const newExpense = {
        id: Date.now().toString(), // Generar ID simple basado en timestamp
        concept,
        amount: parseFloat(amount),
        date // Se espera formato ISO o fecha completa (ej: 2025-12-19)
    };

    await db.update(({ expenses }) => expenses.push(newExpense));

    res.status(201).json(newExpense);
});

// DELETE /api/expenses/:id - Eliminar un gasto
app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;

    // Buscar si existe para devolver 404 si no
    const exists = db.data.expenses.find(e => e.id === id);
    if (!exists) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    await db.update(({ expenses }) => {
        const index = expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            expenses.splice(index, 1);
        }
    });

    res.json({ message: 'Gasto eliminado correctamente', id });
});

// Ruta principal para servir index.html explícitamente (opcional, ya lo hace express.static)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
