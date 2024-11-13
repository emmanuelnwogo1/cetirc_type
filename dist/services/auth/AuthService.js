"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthService = void 0;
const User_1 = require("../../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importStar(require("bcrypt"));
const sequelize_1 = require("sequelize");
const BusinessProfile_1 = require("../../models/BusinessProfile");
const UserProfile_1 = require("../../models/UserProfile");
class AuthService {
    constructor() {
        this.businessLogin = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const business = yield BusinessProfile_1.BusinessProfile.findOne({ where: { email } });
                if (!business) {
                    throw new Error('Business profile does not exist.');
                }
                const isPasswordValid = yield (0, bcrypt_1.compare)(password, business.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid login credentials.');
                }
                const accessToken = jsonwebtoken_1.default.sign({ userId: business.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
                const profilePicture = business.image ? `${business.image}` : null;
                return {
                    status: 'success',
                    message: 'Login successful.',
                    data: {
                        user: {
                            business_id: business.id,
                            username: business.name,
                            fullName: business.name,
                            email: business.email,
                            userType: 'business',
                            profilePicture: profilePicture,
                            token: accessToken,
                            roles: ['user'],
                            preferences: {
                                language: 'en',
                                notifications: {
                                    email: true,
                                    sms: false,
                                },
                            },
                        },
                    },
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = yield User_1.User.findOne({
                where: { email },
                include: [
                    {
                        model: UserProfile_1.UserProfile,
                        as: 'userProfile',
                        attributes: ['email', 'image']
                    }
                ]
            });
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
            const serverUrl = process.env.SERVER_URL;
            const defaultImageUrl = `${process.env.PLACEHOLDER_IMAGE}`;
            if (user.userProfile) {
                user.userProfile.image = user.userProfile.image
                    ? `${serverUrl}/api/${user.userProfile.image}`
                    : defaultImageUrl;
            }
            return {
                status: 'success',
                message: 'Login successful',
                data: {
                    user: {
                        userId: user.id,
                        username: user.username,
                        fullName: user.first_name + user.last_name,
                        email: user.email,
                        phoneNumber: 'Not Provided',
                        userType: 'personal',
                        profilePicture: 'https://cetircstorage.s3.amazonaws.com/profile_images/scaled_1000025451.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GBMFUGOQN4ATMD4%2F20241031%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241031T045614Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=5f3760236199835aaf4fab494fa83159b723003281090b6a87ef90a176642a66',
                        token,
                        roles: ['user'],
                        preferences: {
                            language: 'en',
                            notifications: {
                                email: true,
                                sms: false,
                            },
                        },
                        userProfile: {
                            email: (_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.email,
                            image: (_b = user.userProfile) === null || _b === void 0 ? void 0 : _b.image,
                        },
                    },
                },
            };
        });
    }
    registerUser(username, email, password, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!username || !email || !password || !confirmPassword) {
                    return {
                        status: 'failed',
                        message: 'Registration failed.',
                        data: {
                            error: ['All fields are required.']
                        }
                    };
                }
                if (password !== confirmPassword) {
                    return {
                        status: 'failed',
                        message: 'Registration failed.',
                        data: {
                            password: ['Passwords do not match.']
                        }
                    };
                }
                const existingUser = yield User_1.User.findOne({
                    where: {
                        [sequelize_1.Op.or]: [{ username }, { email }]
                    }
                });
                if (existingUser) {
                    return {
                        status: 'failed',
                        message: 'Registration failed.',
                        data: {
                            username: existingUser.username === username ? ['A user with that username already exists.'] : [],
                            email: existingUser.email === email ? ['A user with that email already exists.'] : []
                        }
                    };
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = yield User_1.User.create({
                    username,
                    email,
                    password: hashedPassword,
                    is_superuser: false,
                    first_name: username,
                    last_name: username,
                    is_staff: false,
                    is_active: false,
                    date_joined: new Date()
                });
                const accessToken = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
                const refreshToken = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });
                return {
                    status: 'success',
                    message: 'User registered successfully.',
                    data: {
                        username: newUser.username,
                        email: newUser.email,
                        access_token: accessToken,
                        refresh_token: refreshToken
                    }
                };
            }
            catch (e) {
                return {
                    status: 'failed',
                    message: 'Failed to register user.',
                    data: { error: e.message }
                };
            }
        });
    }
}
exports.AuthService = AuthService;
