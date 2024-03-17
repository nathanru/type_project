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
var _a, _b;
(_a = document.getElementById("userForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        firstName: formData.get("firstname"),
        lastName: formData.get("lastname"),
        age: Number(formData.get("age"))
    };
    try {
        const response = yield fetch("/submit-user-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error("Failed to submit form.");
        }
        const result = yield response.json();
        document.getElementById("message1").textContent = result.message;
    }
    catch (error) {
        console.error(error);
        document.getElementById("message1").textContent = "An error occurred.";
    }
}));
(_b = document.getElementById("cityForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        country: formData.get("country")
    };
    try {
        const response = yield fetch("/submit-address-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error("Failed to submit form.");
        }
        const result = yield response.json();
        document.getElementById("message2").textContent = result.message;
    }
    catch (error) {
        console.error(error);
        document.getElementById("message2").textContent = "An error occurred.";
    }
}));
//# sourceMappingURL=script.js.map