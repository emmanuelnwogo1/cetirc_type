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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.createUser = exports.getUserById = exports.getUsers = exports.updateUserProfilePhoto = exports.getUserProfileDetails = exports.updateUserProfile = void 0;
const UserProfile_1 = require("../../models/UserProfile");
const User_1 = require("../../models/User");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const updateUserProfile = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userProfile = yield UserProfile_1.UserProfile.findOne({ where: { id: userId } });
        if (!userProfile) {
            return {
                status: "failed",
                message: "User profile does not exist.",
                data: {}
            };
        }
        yield userProfile.update(data);
        return {
            status: "success",
            message: "User profile updated successfully.",
            data: userProfile
        };
    }
    catch (error) {
        return {
            status: "failed",
            message: "Failed to update user profile.",
            data: error
        };
    }
});
exports.updateUserProfile = updateUserProfile;
const getUserProfileDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userProfile = yield UserProfile_1.UserProfile.findOne({ where: { id: userId } });
        if (!userProfile) {
            return {
                status: "error",
                message: "User profile does not exist.",
                data: {}
            };
        }
        const profileData = {
            user_id: userProfile.id,
            username: userProfile.username_id,
            email: userProfile.email,
            image: userProfile.image ? `${userProfile.image}` : null,
            device_id: userProfile.device_id,
            business_associated: userProfile.business_associated
        };
        return {
            status: "success",
            message: "User profile details retrieved successfully.",
            data: profileData
        };
    }
    catch (error) {
        return {
            status: "error",
            message: "Failed to retrieve user profile.",
            data: error
        };
    }
});
exports.getUserProfileDetails = getUserProfileDetails;
const updateUserProfilePhoto = (userId, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!image || !image.path) {
            return {
                status: 'failed',
                message: 'No image file received.',
                data: {},
            };
        }
        const imageBuffer = yield fs_1.default.promises.readFile(image.path);
        const user = yield User_1.User.findOne({ where: { id: userId } });
        if (!user) {
            return {
                status: 'failed',
                message: 'Unauthorized.',
                data: {},
            };
        }
        let profile = yield UserProfile_1.UserProfile.findOne({
            where: { username_id: userId },
        });
        if (!profile) {
            profile = yield UserProfile_1.UserProfile.create({
                username_id: user.id,
                email: user.email,
            });
        }
        const fileExtension = path_1.default.extname(image.originalname) || '.png';
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const imageName = `image_${timestamp}${fileExtension}`;
        const imagePath = path_1.default.join(__dirname, '../../../images/', imageName);
        console.log(imagePath);
        yield fs_1.default.promises.writeFile(imagePath, imageBuffer);
        const serverUrl = process.env.SERVER_URL;
        const fullImageUrl = `${serverUrl}/api/images/${imageName}`;
        profile.image = `images/${imageName}`;
        yield profile.save();
        return {
            status: 'success',
            message: 'Profile photo updated successfully.',
            data: { image_url: fullImageUrl },
        };
    }
    catch (error) {
        return {
            status: 'failed',
            message: 'An error occurred while updating the profile photo.',
            data: { error: error.message || 'Unknown error' },
        };
    }
});
exports.updateUserProfilePhoto = updateUserProfilePhoto;
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.findAll();
});
exports.getUsers = getUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.findByPk(id);
});
exports.getUserById = getUserById;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new User_1.User(userData);
    return yield newUser.save();
});
exports.createUser = createUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.destroy({
        where: {
            id: parseInt(id)
        }
    });
});
exports.deleteUser = deleteUser;
