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
exports.AuthController = void 0;
const AuthService_1 = require("../../services/auth/AuthService");
const authService = new AuthService_1.AuthService();
class AuthController {
    constructor() {
        this.loginBusiness = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield authService.businessLogin(email, password);
                res.status(200).json(result);
            }
            catch (error) {
                console.error(error);
                res.status(401).json({
                    status: 'failed',
                    message: error.message,
                    data: {},
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const response = yield authService.loginUser(email, password);
                res.status(200).json(response);
            }
            catch (error) {
                res.status(401).json({
                    status: 'fail',
                    message: error.message || 'Login failed',
                });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, confirm_password: confirmPassword } = req.body;
                const result = yield authService.registerUser(username, email, password, confirmPassword);
                if (result.status === 'failed') {
                    res.status(400).json(result);
                }
                else {
                    res.status(201).json(result);
                }
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: 'Failed to create user.',
                    data: {}
                });
            }
        });
    }
}
exports.AuthController = AuthController;
