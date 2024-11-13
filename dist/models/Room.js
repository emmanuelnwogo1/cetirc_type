"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const SmartLockGroup_1 = require("./SmartLockGroup");
const SmartLock_1 = require("./SmartLock");
let Room = class Room extends sequelize_typescript_1.Model {
};
exports.Room = Room;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], Room.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], Room.prototype, "room_id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], Room.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], Room.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SmartLockGroup_1.SmartLockGroup),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], Room.prototype, "group_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SmartLockGroup_1.SmartLockGroup)
], Room.prototype, "smartLockGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SmartLock_1.SmartLock)
], Room.prototype, "smartLocks", void 0);
exports.Room = Room = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'image_processing_app_room', timestamps: false })
], Room);
