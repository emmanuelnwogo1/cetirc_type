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
exports.CardService = void 0;
const Card_1 = require("../../models/Card");
const UserProfile_1 = require("../../models/UserProfile");
class CardService {
    constructor() {
        this.updateCard = (cardId, data, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const card = yield Card_1.Card.findOne({
                    where: { id: cardId }
                });
                if (!card) {
                    return {
                        status: "failed",
                        message: "Card not found.",
                        data: {}
                    };
                }
                yield card.update(data);
                return {
                    status: "success",
                    message: "Card updated successfully.",
                    data: card
                };
            }
            catch (error) {
                return {
                    status: "failed",
                    message: "Failed to update card.",
                    data: error
                };
            }
        });
        this.getUserCards = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfile = yield UserProfile_1.UserProfile.findOne({ where: { username_id: userId } });
                if (!userProfile) {
                    return {
                        status: "error",
                        message: "User profile does not exist.",
                        data: {}
                    };
                }
                const cards = yield Card_1.Card.findAll({ where: { user_profile_id: userProfile.id } });
                return {
                    status: "success",
                    message: "Cards retrieved successfully.",
                    data: cards
                };
            }
            catch (error) {
                return {
                    status: "error",
                    message: "Failed to retrieve cards.",
                    data: error
                };
            }
        });
    }
    addCard(user, cardData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user.id);
            const userProfile = yield UserProfile_1.UserProfile.findOne({ where: { username_id: user.id } });
            if (!userProfile) {
                return {
                    status: "failed",
                    message: "User profile not found.",
                    data: {}
                };
            }
            // Create the card
            const newCard = yield Card_1.Card.create(Object.assign(Object.assign({}, cardData), { user_profile_id: userProfile.id }));
            return {
                status: "success",
                message: "Card added successfully.",
                data: newCard
            };
        });
    }
}
exports.CardService = CardService;
