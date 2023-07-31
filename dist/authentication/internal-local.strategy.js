"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("./authentication.service");
let ILocalStrategy = class ILocalStrategy extends passport_1.PassportStrategy(passport_local_1.Strategy, 'internal') {
    constructor(authenticationService) {
        super({
            usernameField: 'email',
        });
        this.authenticationService = authenticationService;
    }
    validate(email, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("employee - strategy");
            return this.authenticationService.IvalidateUser(email, password);
        });
    }
};
ILocalStrategy = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], ILocalStrategy);
exports.ILocalStrategy = ILocalStrategy;
//# sourceMappingURL=internal-local.strategy.js.map