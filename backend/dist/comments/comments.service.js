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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const comment_schema_1 = require("../mongo/schemas/comment.schema");
const event_schema_1 = require("../mongo/schemas/event.schema");
const mongoose_2 = require("mongoose");
const comments_gateway_1 = require("../realtime/comments.gateway");
let CommentsService = class CommentsService {
    commentModel;
    eventModel;
    commentsGateway;
    constructor(commentModel, eventModel, commentsGateway) {
        this.commentModel = commentModel;
        this.eventModel = eventModel;
        this.commentsGateway = commentsGateway;
    }
    async addComment(ticketId, authorId, body) {
        const c = await this.commentModel.create({ ticketId, authorId, body });
        await this.eventModel.create({
            type: 'COMMENT_ADDED',
            ticketId,
            actorId: authorId,
            payload: {},
        });
        this.commentsGateway.emitNewComment(ticketId, {
            _id: c._id,
            ticketId,
            authorId,
            body,
            createdAt: c.createdAt,
        });
        return c;
    }
    async listComments(ticketId, limit = 50) {
        return this.commentModel
            .find({ ticketId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(1, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        comments_gateway_1.CommentsGateway])
], CommentsService);
//# sourceMappingURL=comments.service.js.map