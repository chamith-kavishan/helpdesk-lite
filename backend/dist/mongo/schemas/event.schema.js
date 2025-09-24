"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = exports.Event = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Event = class Event {
    type;
    ticketId;
    actorId;
    payload;
    createdAt;
};
exports.Event = Event;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['TICKET_CREATED', 'ASSIGNED', 'STATUS_CHANGED', 'COMMENT_ADDED'],
    }),
    __metadata("design:type", String)
], Event.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Event.prototype, "ticketId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Event.prototype, "actorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Event.prototype, "payload", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)({ timestamps: { createdAt: true, updatedAt: false } })
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);
exports.EventSchema.index({ ticketId: 1, createdAt: -1 });
//# sourceMappingURL=event.schema.js.map