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
exports.searchPalmShareController = exports.deletePalmShareMemberController = exports.palmShareUpdateMemberController = exports.palmShareMemmebersController = exports.palmShareController = void 0;
const palmShareService_1 = require("../services/palmShareService");
const User_1 = require("../models/User");
const palmShareController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { allowed_username, max_amount } = req.body;
    const ownerId = req.user.id;
    if (!allowed_username || max_amount === undefined) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid input.',
            data: {}
        });
    }
    try {
        const result = yield (0, palmShareService_1.savePalmShareSettings)(ownerId, allowed_username, max_amount);
        if (result.status === 'failed') {
            res.status(404).json(result);
        }
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error saving palm share settings:", error);
        res.status(500).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
});
exports.palmShareController = palmShareController;
const palmShareMemmebersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne(req.user.id);
        const members = yield (0, palmShareService_1.getPalmShareMembers)(user.username);
        res.status(200).json({
            status: 'success',
            message: 'PalmShare members retrieved successfully.',
            data: members
        });
    }
    catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
});
exports.palmShareMemmebersController = palmShareMemmebersController;
const palmShareUpdateMemberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedUsername = req.params.allowed_username;
    const user = yield User_1.User.findOne(req.user.id);
    try {
        const updateData = req.body;
        const updatedMember = yield (0, palmShareService_1.updatePalmShareMember)(allowedUsername, user, updateData);
        res.status(200).json({
            status: 'success',
            message: 'PalmShare member updated successfully.',
            data: updatedMember
        });
    }
    catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
});
exports.palmShareUpdateMemberController = palmShareUpdateMemberController;
const deletePalmShareMemberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { allowedUsername } = req.params;
    const userId = req.user.id;
    try {
        const response = yield (0, palmShareService_1.deletePalmShareMember)(allowedUsername, userId);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error.message,
            data: {},
        });
    }
});
exports.deletePalmShareMemberController = deletePalmShareMemberController;
const searchPalmShareController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedUsername = req.query.allowed_username;
    const dateCreated = req.query.date_created;
    const result = yield (0, palmShareService_1.searchPalmShare)(allowedUsername, dateCreated);
    if (result.status === 'failed') {
        res.status(400).json(result);
    }
    else if (result.status === 'success') {
        res.status(200).json(result);
    }
    else {
        res.status(404).json(result);
    }
});
exports.searchPalmShareController = searchPalmShareController;
