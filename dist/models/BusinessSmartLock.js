"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessSmartLock = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const BusinessProfile_1 = require("./BusinessProfile");
const SmartLock_1 = require("./SmartLock");
const SmartLockGroup_1 = require("./SmartLockGroup");
let BusinessSmartLock = class BusinessSmartLock extends sequelize_typescript_1.Model {
};
exports.BusinessSmartLock = BusinessSmartLock;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], BusinessSmartLock.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => BusinessProfile_1.BusinessProfile),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], BusinessSmartLock.prototype, "business_profile_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SmartLockGroup_1.SmartLockGroup),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], BusinessSmartLock.prototype, "business_type_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SmartLock_1.SmartLock),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], BusinessSmartLock.prototype, "smart_lock_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => BusinessProfile_1.BusinessProfile)
], BusinessSmartLock.prototype, "businessProfile", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SmartLockGroup_1.SmartLockGroup)
], BusinessSmartLock.prototype, "businessType", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SmartLock_1.SmartLock)
], BusinessSmartLock.prototype, "smartLock", void 0);
exports.BusinessSmartLock = BusinessSmartLock = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'image_processing_app_businesssmartlock', timestamps: false })
], BusinessSmartLock);
