"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBusinessProfileImage = exports.getNearestBusinesses = exports.getBusinessLocations = exports.registerBusiness = exports.updateBusinessProfile = exports.getNearbyBusinesses = void 0;
const axios_1 = __importDefault(require("axios"));
const geolib = __importStar(require("geolib"));
const BusinessProfile_1 = require("../../models/BusinessProfile");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = require("http-errors");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const User_1 = require("../../models/User");
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const getNearbyBusinesses = (userLocation) => __awaiter(void 0, void 0, void 0, function* () {
    const nearbyBusinesses = [];
    const businesses = yield BusinessProfile_1.BusinessProfile.findAll();
    for (const business of businesses) {
        if (business.address && business.city && business.state && business.zip_code) {
            const address = `${business.address}, ${business.city}, ${business.state} ${business.zip_code}`;
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`;
            const geocodeResponse = yield axios_1.default.get(geocodeUrl);
            const geocodeData = geocodeResponse.data;
            if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
                const businessLocation = geocodeData.results[0].geometry.location;
                const distance = geolib.getDistance(userLocation, { latitude: businessLocation.lat, longitude: businessLocation.lng });
                nearbyBusinesses.push({
                    business,
                    distance,
                    latitude: businessLocation.lat,
                    longitude: businessLocation.lng,
                });
            }
        }
    }
    // top 5 nearest businesses
    return nearbyBusinesses.sort((a, b) => a.distance - b.distance).slice(0, 5);
});
exports.getNearbyBusinesses = getNearbyBusinesses;
const updateBusinessProfile = (businessId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const businessProfile = yield BusinessProfile_1.BusinessProfile.findByPk(businessId);
    if (!businessProfile) {
        throw new Error("Business profile not found.");
    }
    yield businessProfile.update(data);
    return businessProfile.toJSON();
});
exports.updateBusinessProfile = updateBusinessProfile;
const registerBusiness = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
    try {
        const businessProfile = yield BusinessProfile_1.BusinessProfile.create(Object.assign(Object.assign({}, data), { password: hashedPassword }));
        if (!businessProfile) {
            throw new http_errors_1.NotFound('Failed to register business.');
        }
        return businessProfile;
    }
    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new http_errors_1.Conflict('Email already exists. Please use a different email.');
        }
        throw error;
    }
});
exports.registerBusiness = registerBusiness;
const getBusinessLocations = () => __awaiter(void 0, void 0, void 0, function* () {
    const businesses = yield BusinessProfile_1.BusinessProfile.findAll();
    const results = [];
    for (const business of businesses) {
        const address = `${business.address}, ${business.city}, ${business.state} ${business.zip_code}`;
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        try {
            const response = yield axios_1.default.get(geocodingUrl);
            const data = response.data;
            if (data.status === 'OK') {
                const location = data.results[0].geometry.location;
                results.push({
                    name: business.name,
                    device_id: business.device_id,
                    location
                });
            }
            else {
                throw new Error(`Failed to geocode address: ${address}, status: ${data.status}`);
            }
        }
        catch (error) {
            throw new Error(`Error while geocoding address: ${address}, error: ${error.message}`);
        }
    }
    return results.length > 0
        ? { status: 'success', message: 'Operation completed successfully.', data: results }
        : { status: 'failed', message: 'No valid addresses found or geocoding failed for all addresses', data: {} };
});
exports.getBusinessLocations = getBusinessLocations;
const getNearestBusinesses = (userLatitude, userLongitude) => __awaiter(void 0, void 0, void 0, function* () {
    const userCoords = { latitude: userLatitude, longitude: userLongitude };
    const businesses = yield BusinessProfile_1.BusinessProfile.findAll();
    const businessDistances = [];
    for (const business of businesses) {
        const address = `${business.address}, ${business.city}, ${business.state} ${business.zip_code}`;
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        try {
            console.log(geocodingUrl);
            const response = yield axios_1.default.get(geocodingUrl);
            const data = response.data;
            if (data.status === 'OK' && data.results.length) {
                const location = data.results[0].geometry.location;
                const distance = calculateDistance(userCoords, location);
                businessDistances.push({
                    distance,
                    business: {
                        name: business.name,
                        image: business.image,
                        location
                    }
                });
            }
            else {
                throw new Error(`Failed to geocode address: ${address}`);
            }
        }
        catch (error) {
            throw new Error(`Error geocoding address: ${address}, error: ${error.message}`);
        }
    }
    businessDistances.sort((a, b) => a.distance - b.distance);
    return businessDistances.slice(0, 10);
});
exports.getNearestBusinesses = getNearestBusinesses;
// Helper function to calculate distance
function calculateDistance(coords1, coords2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = deg2rad(coords2.lat - coords1.latitude);
    const dLng = deg2rad(coords2.lng - coords1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coords1.latitude)) * Math.cos(deg2rad(coords2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
const updateBusinessProfileImage = (userId, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!image || !image.path) {
            return {
                status: 'failed',
                message: 'No image file received.',
                data: {},
            };
        }
        const imageBuffer = yield fs_1.default.promises.readFile(image.path);
        const user = yield User_1.User.findOne({ where: { id: userId } });
        if (!user) {
            return {
                status: 'failed',
                message: 'Unauthorized.',
                data: {},
            };
        }
        let profile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
        if (!profile) {
            profile = yield BusinessProfile_1.BusinessProfile.create({ user_id: user.id });
        }
        const fileExtension = path_1.default.extname(image.originalname) || '.png';
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const imageName = `business_image_${timestamp}${fileExtension}`;
        const imagePath = path_1.default.join(__dirname, '../../../business_images/', imageName);
        yield fs_1.default.promises.writeFile(imagePath, imageBuffer);
        yield fs_1.default.promises.unlink(image.path);
        const serverUrl = process.env.SERVER_URL;
        const fullImageUrl = `${serverUrl}/api/business_images/${imageName}`;
        profile.image = `business_images/${imageName}`;
        yield profile.save();
        return {
            status: 'success',
            message: 'Profile photo updated successfully.',
            data: { image_url: fullImageUrl },
        };
    }
    catch (error) {
        console.error("Error updating business profile photo:", error);
        return {
            status: 'failed',
            message: 'An error occurred while updating the profile photo.',
            data: { error: error.message || 'Unknown error' },
        };
    }
});
exports.updateBusinessProfileImage = updateBusinessProfileImage;
