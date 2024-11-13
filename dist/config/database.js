"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("../models/User");
const BusinessProfile_1 = require("../models/BusinessProfile");
const BusinessDashboard_1 = require("../models/BusinessDashboard");
const PalmShare_1 = require("../models/PalmShare");
const TransactionHistory_1 = require("../models/TransactionHistory");
const PasswordResetRequest_1 = require("../models/PasswordResetRequest");
const Card_1 = require("../models/Card");
const UserProfile_1 = require("../models/UserProfile");
const SmartLock_1 = require("../models/SmartLock");
const SmartLockGroup_1 = require("../models/SmartLockGroup");
const UserSmartLockAccess_1 = require("../models/UserSmartLockAccess");
const BusinessSmartLock_1 = require("../models/BusinessSmartLock");
const Room_1 = require("../models/Room");
const Notification_1 = require("../models/Notification");
const Permission_1 = require("../models/Permission");
const Withdrawal_1 = require("../models/Withdrawal");
const Transaction_1 = require("../models/Transaction");
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    models: [User_1.User, BusinessProfile_1.BusinessProfile, BusinessDashboard_1.BusinessDashboard, PalmShare_1.PalmShare, TransactionHistory_1.TransactionHistory,
        PasswordResetRequest_1.PasswordResetRequest, Card_1.Card, UserProfile_1.UserProfile,
        SmartLock_1.SmartLock, SmartLockGroup_1.SmartLockGroup, UserSmartLockAccess_1.UserSmartLockAccess,
        BusinessSmartLock_1.BusinessSmartLock, Room_1.Room, Notification_1.Notification, Permission_1.Permission,
        Withdrawal_1.Withdrawal, Transaction_1.Transaction
    ],
});
exports.default = sequelize;
