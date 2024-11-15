"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const roomListController_1 = require("../controllers/room/roomListController");
const roomDetailController_1 = require("../controllers/room/roomDetailController");
const roomSmartLockController_1 = require("../controllers/room/smartlock/roomSmartLockController");
const roomAccessController_1 = require("../controllers/room/access/roomAccessController");
const deleteUserAccessFromRoomController_1 = require("../controllers/room/access/deleteUserAccessFromRoomController");
const editUserAccessController_1 = require("../controllers/room/access/editUserAccessController");
const router = express_1.default.Router();
router.get('/rooms/:business_type', authMiddleware_1.default, roomListController_1.roomListController);
router.get('/rooms/:business_type/:pk', authMiddleware_1.default, roomDetailController_1.roomDetailController);
router.post('/assign-smart-lock-to-room/:id', authMiddleware_1.default, roomSmartLockController_1.roomSmartLockController);
router.get('/user-access/:room_id', authMiddleware_1.default, roomAccessController_1.viewUserAccessInRoomController);
router.delete('/remove-access/:user_id', authMiddleware_1.default, deleteUserAccessFromRoomController_1.deleteUserAccessFromRoomController);
router.post('/grant-access/:business_type', authMiddleware_1.default, roomAccessController_1.createUserAccessController);
router.patch('/update-access/:user_id', authMiddleware_1.default, editUserAccessController_1.editUserAccessController);
exports.default = router;
