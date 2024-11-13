import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import sequelize from './config/database';
import businessRoutes from './routes/businessRoutes';
import businessDashboardRoutes from './routes/businessDashboardRoutes';
import palmShareRoutes from './routes/palmShareRoutes';
import transactionRoutes from './routes/transactionRoutes';
import './types/global';
import passwordResetRoutes from './routes/passwordResetRoutes';
import cardRoutes from './routes/cardRoutes';
import userRoutes from './routes/userRoutes';
import userSmartLockRoutes from './routes/userSmartLockRoutes';
import notificationRoutes from './routes/notificationRoutes';
import roomRoutes from './routes/roomRoutes';
import groupRoutes from './routes/groupRoutes';
import withdrawCodeRoutes from './routes/withdrawCodeRoutes';
import businessPaymentRoutes from './routes/businessPaymentRoutes';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/images/', express.static(path.join(__dirname, '../images')));
app.use('/api/business_images/', express.static(path.join(__dirname, '../business_images')));
app.use('/api', authRoutes);
app.use('/api', businessRoutes);
app.use('/api', businessDashboardRoutes);
app.use('/api', palmShareRoutes);
app.use('/api', transactionRoutes);
app.use('/api', passwordResetRoutes);
app.use('/api', cardRoutes);
app.use('/api', userRoutes);
app.use('/api', userSmartLockRoutes);
app.use('/api', roomRoutes);
app.use('/api', notificationRoutes);
app.use('/api', groupRoutes);
app.use('/api', withdrawCodeRoutes);
app.use('/api', businessPaymentRoutes);

app.get('/api/stripe/card-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/stripe/card_form.html'));
});

// crud routes
const crudDir = path.join(__dirname, './crud');
fs.readdirSync(crudDir).forEach((file: any) => {
  const modelName = file.replace('.ts', '');
  const crudRoutes = require(path.join(crudDir, file)).default;
  app.use(`/api/admin/${modelName}s`, crudRoutes);
});

sequelize.sync();
export default app;
