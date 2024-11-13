"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartLock = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const SmartLockGroup_1 = require("./SmartLockGroup");
const Room_1 = require("./Room");
let SmartLock = class SmartLock extends sequelize_typescript_1.Model {
};
exports.SmartLock = SmartLock;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], SmartLock.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], SmartLock.prototype, "device_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], SmartLock.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], SmartLock.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => SmartLockGroup_1.SmartLockGroup),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], SmartLock.prototype, "group_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => Room_1.Room),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], SmartLock.prototype, "room_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SmartLockGroup_1.SmartLockGroup)
], SmartLock.prototype, "smartLockGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Room_1.Room)
], SmartLock.prototype, "room", void 0);
exports.SmartLock = SmartLock = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'image_processing_app_smartlock', timestamps: false })
], SmartLock);
