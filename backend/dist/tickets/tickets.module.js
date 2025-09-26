"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsModule = void 0;
const common_1 = require("@nestjs/common");
const tickets_controller_1 = require("./tickets.controller");
const tickets_service_1 = require("./tickets.service");
const comments_service_1 = require("../comments/comments.service");
const mongoose_1 = require("@nestjs/mongoose");
const comment_schema_1 = require("../mongo/schemas/comment.schema");
const event_schema_1 = require("../mongo/schemas/event.schema");
const comments_gateway_1 = require("../realtime/comments.gateway");
let TicketsModule = class TicketsModule {
};
exports.TicketsModule = TicketsModule;
exports.TicketsModule = TicketsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: comment_schema_1.Comment.name, schema: comment_schema_1.CommentSchema },
                { name: event_schema_1.Event.name, schema: event_schema_1.EventSchema },
            ]),
        ],
        controllers: [tickets_controller_1.TicketsController],
        providers: [tickets_service_1.TicketsService, comments_service_1.CommentsService, comments_gateway_1.CommentsGateway],
    })
], TicketsModule);
//# sourceMappingURL=tickets.module.js.map