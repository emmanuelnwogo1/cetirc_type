"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartLockGroup = exports.BusinessType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const SmartLock_1 = require("./SmartLock");
var BusinessType;
(function (BusinessType) {
    BusinessType["APARTMENT"] = "apartment";
    BusinessType["SCHOOL"] = "school";
    BusinessType["GYM"] = "gym";
    BusinessType["HOTEL"] = "hotel";
    BusinessType["RETAIL_STORE"] = "retail_store";
    BusinessType["COMPANY"] = "company";
    BusinessType["AIRBNB"] = "airbnb";
    BusinessType["OTHERS"] = "others";
})(BusinessType || (exports.BusinessType = BusinessType = {}));
let SmartLockGroup = class SmartLockGroup extends sequelize_typescript_1.Model {
};
exports.SmartLockGroup = SmartLockGroup;
SmartLockGroup.BUSINESS_TYPES = Object.values(BusinessType);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], SmartLockGroup.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], SmartLockGroup.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], SmartLockGroup.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SmartLock_1.SmartLock)
], SmartLockGroup.prototype, "smartLocks", void 0);
exports.SmartLockGroup = SmartLockGroup = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'image_processing_app_smartlockgroup', timestamps: false })
], SmartLockGroup);
