"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMongoIndexes = initMongoIndexes;
async function initMongoIndexes(models) {
    await Promise.all(models.map((m) => m.init()));
}
//# sourceMappingURL=mongo-init.js.map