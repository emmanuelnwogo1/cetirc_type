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
exports.deleteUserAccessFromRoomController = void 0;
const deleteUserAccessFromRoomService_1 = require("../../../services/room/smartlock/access/deleteUserAccessFromRoomService");
const deleteUserAccessFromRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = parseInt(req.params.user_id, 10);
    if (!user_id) {
        res.status(404).json({
            status: "failed",
            message: "User id not provided",
            data: {}
        });
    }
    else {
        const result = yield (0, deleteUserAccessFromRoomService_1.removeUserAccessFromRoom)(user_id, req.user);
        res.status(result.statusCode).json(result.data);
    }
});
exports.deleteUserAccessFromRoomController = deleteUserAccessFromRoomController;
