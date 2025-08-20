import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import storeRoutes from './routes/stores.js';
import adminRoutes from './routes/admin.js';
import ownerRoutes from './routes/owner.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req,res)=>res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/stores', storeRoutes);
app.use('/admin', adminRoutes);
app.use('/owner', ownerRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
