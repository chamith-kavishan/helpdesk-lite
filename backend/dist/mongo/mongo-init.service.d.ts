import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { CommentDocument } from './schemas/comment.schema';
import { EventDocument } from './schemas/event.schema';
export declare class MongoInitService implements OnModuleInit {
    private readonly commentModel;
    private readonly eventModel;
    constructor(commentModel: Model<CommentDocument>, eventModel: Model<EventDocument>);
    onModuleInit(): Promise<void>;
}
