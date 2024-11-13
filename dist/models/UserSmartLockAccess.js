"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSmartLockAccess = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const SmartLock_1 = require("./SmartLock");
const Room_1 = require("./Room");
let UserSmartLockAccess = class UserSmartLockAccess extends sequelize_typescript_1.Model {
};
exports.UserSmartLockAccess = UserSmartLockAccess;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], UserSmartLockAccess.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => SmartLock_1.SmartLock),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], UserSmartLockAccess.prototype, "smart_lock_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], UserSmartLockAccess.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], UserSmartLockAccess.prototype, "granted_at", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], UserSmartLockAccess.prototype, "granted_by_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], UserSmartLockAccess.prototype, "period", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => Room_1.Room),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], UserSmartLockAccess.prototype, "room_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SmartLock_1.SmartLock)
], UserSmartLockAccess.prototype, "smartLock", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User)
], UserSmartLockAccess.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Room_1.Room)
], UserSmartLockAccess.prototype, "room", void 0);
exports.UserSmartLockAccess = UserSmartLockAccess = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'image_processing_app_usersmartlockaccess', timestamps: false })
], UserSmartLockAccess);
