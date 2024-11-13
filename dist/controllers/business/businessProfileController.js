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
exports.updateBusinessProfileImageController = exports.fetchBusinessProfileDetails = void 0;
const businessProfileService_1 = require("../../services/business/businessProfileService");
const businessService_1 = require("../../services/business/businessService");
const fetchBusinessProfileDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield (0, businessProfileService_1.getBusinessProfileDetails)(userId);
    if (result.status === "success") {
        res.status(200).json(result);
    }
    else if (result.message === "Business profile does not exist.") {
        res.status(404).json(result);
    }
    else {
        res.status(500).json(result);
    }
});
exports.fetchBusinessProfileDetails = fetchBusinessProfileDetails;
const updateBusinessProfileImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const image = req.file;
    if (!image) {
        res.status(400).json({
            status: 'failed',
            message: 'No image file uploaded.',
        });
        return;
    }
    const result = yield (0, businessService_1.updateBusinessProfileImage)(userId, image);
    res.json(result);
});
exports.updateBusinessProfileImageController = updateBusinessProfileImageController;
