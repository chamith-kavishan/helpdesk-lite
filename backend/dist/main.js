"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
require("dotenv/config");
const app_module_1 = require("./app.module");
const init_db_1 = require("./db/init-db");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || true,
        credentials: true,
    });
    await (0, init_db_1.initMySqlSchema)();
    await app.listen(Number(process.env.PORT) || 4000);
}
bootstrap().catch((err) => {
    console.error('Error starting app:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map