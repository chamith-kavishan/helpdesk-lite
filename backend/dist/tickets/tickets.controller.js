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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const zod_pipe_1 = require("../common/zod.pipe");
const dto_1 = require("./dto");
const tickets_service_1 = require("./tickets.service");
const comments_service_1 = require("../comments/comments.service");
const zod_1 = require("zod");
let TicketsController = class TicketsController {
    tickets;
    comments;
    constructor(tickets, comments) {
        this.tickets = tickets;
        this.comments = comments;
    }
    create(req, dto) {
        return this.tickets.createTicket({ ...dto, created_by: req.user.id });
    }
    async list(req, q, status, page = '1', limit = '10') {
        return this.tickets.listTickets(q, status, Number(page), Number(limit), req.user);
    }
    get(req, id) {
        return this.tickets.getTicket(Number(id), req.user);
    }
    update(req, id, dto) {
        return this.tickets.updateTicket(Number(id), dto, req.user);
    }
    assign(req, id, dto) {
        return this.tickets.assignTicket(Number(id), dto.assigned_to, req.user);
    }
    addComment(req, id, dto) {
        return this.comments.addComment(Number(id), req.user.id, dto.body);
    }
    listComments(req, id) {
        return this.tickets
            .getTicket(Number(id), req.user)
            .then(() => this.comments.listComments(Number(id)));
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)('tickets'),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(dto_1.CreateTicketDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('tickets'),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)('tickets/:id'),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(dto_1.UpdateTicketDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('tickets/:id/assign'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(dto_1.AssignDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)('tickets/:id/comments'),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(zod_1.z.object({ body: zod_1.z.string().min(1) })))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)('tickets/:id/comments'),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "listComments", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService,
        comments_service_1.CommentsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map