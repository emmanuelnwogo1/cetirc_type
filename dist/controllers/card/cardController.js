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
exports.CardController = void 0;
const cardService_1 = require("../../services/card/cardService");
const User_1 = require("../../models/User");
const cardService = new cardService_1.CardService();
class CardController {
    constructor() {
        this.editCard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cardId = parseInt(req.params.id);
            const userId = req.user.id;
            const data = req.body;
            console.log(data, cardId, userId);
            const result = yield cardService.updateCard(cardId, data, userId);
            if (result.status === "success") {
                res.status(200).json(result);
            }
            else if (result.message === "Card not found.") {
                res.status(404).json(result);
            }
            else {
                res.status(400).json(result);
            }
        });
        this.fetchUserCards = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const result = yield cardService.getUserCards(userId);
            if (result.status === "success") {
                res.status(200).json(result);
            }
            else if (result.message === "User profile does not exist.") {
                res.status(404).json(result);
            }
            else {
                res.status(500).json(result);
            }
        });
    }
    addCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({
                where: {
                    id: req.user.id
                }
            });
            console.log(req.user.id, user);
            const cardData = req.body;
            try {
                const response = yield cardService.addCard(user, cardData);
                if (response.status == 'success') {
                    return res.status(201).json({
                        status: 'success',
                        message: 'Card added successfully.',
                        data: response.data
                    });
                }
                else {
                    return res.status(404).json({
                        status: 'failed',
                        message: 'User profile not found.',
                        data: {}
                    });
                }
            }
            catch (error) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Failed to add card.',
                    data: error.message
                });
            }
        });
    }
}
exports.CardController = CardController;
