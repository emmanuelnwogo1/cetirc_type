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
exports.createUserAccessController = exports.viewUserAccessInRoomController = void 0;
const roomAccessService_1 = require("../../../services/room/smartlock/access/roomAccessService");
const viewUserAccessInRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = parseInt(req.params.room_id);
    const result = yield (0, roomAccessService_1.getUserAccessInRoom)(roomId, req.user);
    res.status(result.statusCode).json(result.data);
});
exports.viewUserAccessInRoomController = viewUserAccessInRoomController;
const createUserAccessController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessType = req.params.business_type;
    const result = yield (0, roomAccessService_1.grantUserAccess)(req.body, businessType, req.user);
    res.status(result.statusCode).json(result.data);
});
exports.createUserAccessController = createUserAccessController;
