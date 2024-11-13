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
exports.getWithdrawCodeController = void 0;
const withdrawCodeService_1 = require("../services/withdrawCodeService");
const getWithdrawCodeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield (0, withdrawCodeService_1.getWithdrawCode)(userId);
    res.status(result.statusCode).json({
        status: result.status,
        message: result.message,
        data: result.data
    });
});
exports.getWithdrawCodeController = getWithdrawCodeController;
