"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const cardController_1 = require("../controllers/card/cardController");
const router = (0, express_1.Router)();
const cardController = new cardController_1.CardController();
router.post('/cards/add', authMiddleware_1.default, cardController.addCard);
router.put('/cards/update/:id', authMiddleware_1.default, cardController.editCard);
router.get('/user_cards', authMiddleware_1.default, cardController.fetchUserCards);
exports.default = router;
