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
exports.deleteUserController = exports.createUserController = exports.getUserByIdController = exports.getUsersController = exports.updateProfilePhotoController = exports.fetchUserProfileDetails = exports.editUserProfile = void 0;
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
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getUsersController = getUsersController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield (0, userService_1.getUserById)(id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getUserByIdController = getUserByIdController;
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield (0, userService_1.createUser)(req.body);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ message: 'Bad request.' });
    }
});
exports.createUserController = createUserController;
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, userService_1.deleteUser)(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.deleteUserController = deleteUserController;
