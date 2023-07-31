"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors();
        const options = new swagger_1.DocumentBuilder()
            .setTitle('E-COMMERCE')
            .addBearerAuth()
            .setDescription('API')
            .setVersion('1.0')
            .build();
        yield app.listen(process.env.PORT || 3000);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map