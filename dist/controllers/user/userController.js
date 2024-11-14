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
exports.updateProfilePhotoController = exports.fetchUserProfileDetails = exports.editUserProfile = void 0;
const userService_1 = require("../../services/user/userService");
const editUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const data = req.body;
    const result = yield (0, userService_1.updateUserProfile)(userId, data);
    if (result.status === "success") {
        res.status(200).json(result);
    }
    else if (result.status === "failed") {
        res.status(404).json(result);
    }
    else {
        res.status(400).json(result);
    }
});
exports.editUserProfile = editUserProfile;
const fetchUserProfileDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield (0, userService_1.getUserProfileDetails)(userId);
    if (result.status === "success") {
        res.status(200).json(result);
    }
    else if (result.status === "failed") {
        res.status(404).json(result);
    }
    else {
        res.status(500).json(result);
    }
});
exports.fetchUserProfileDetails = fetchUserProfileDetails;
const updateProfilePhotoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const image = req.file;
        if (!image) {
            res.status(400).json({
                status: 'failed',
                message: 'No image file uploaded.',
            });
        }
        else {
            const result = yield (0, userService_1.updateUserProfilePhoto)(userId, image);
            if (result.status === 'failed') {
                res.status(400).json(result);
            }
            else {
                res.status(200).json(result);
            }
        }
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
        });
    }
});
exports.updateProfilePhotoController = updateProfilePhotoController;
