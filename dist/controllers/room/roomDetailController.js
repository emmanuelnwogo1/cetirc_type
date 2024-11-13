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
exports.roomDetailController = void 0;
const roomDetailService_1 = require("../../services/room/roomDetailService");
const roomDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessType = req.params.business_type;
    const roomId = parseInt(req.params.pk);
    const result = yield (0, roomDetailService_1.getRoomDetails)(businessType, roomId);
    res.status(result.statusCode).json(result.data);
});
exports.roomDetailController = roomDetailController;
