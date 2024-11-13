"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = void 0;
const SmartLockGroup_1 = require("../../models/SmartLockGroup");
const createGroup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingGroup = yield SmartLockGroup_1.SmartLockGroup.findOne({ where: { name: data.name } });
        if (existingGroup) {
            return {
                statusCode: 400,
                status: "failed",
                message: "Invalid input.",
                data: {
                    name: ["A smart lock group with this name already exists."]
                }
            };
        }
        const newGroup = yield SmartLockGroup_1.SmartLockGroup.create({
            name: data.name,
            description: data.description
        });
        return {
            statusCode: 201,
            status: "success",
            message: "SmartLockGroup created successfully.",
            data: newGroup
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            status: "failed",
            message: "An error occurred while creating the group.",
            data: {}
        };
    }
});
exports.createGroup = createGroup;
