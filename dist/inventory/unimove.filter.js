"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roles_constants_1 = require("./../users/roles.constants");
function UnimoveFilter(user) {
    console.log('filter', user);
    let filter = {};
    if (user.roles.includes(roles_constants_1.UserRole.UnimoveSuperAdmin) || user.roles.includes(roles_constants_1.UserRole.ADMIN)) {
        filter = {
            $or: [
                {
                    org_from_id: user.organization_id
                },
                {
                    org_to_id: user.organization_id
                },
                {
                    organization_id: user.organization_id
                }
            ]
        };
        return filter;
    }
    else if (user.roles.includes(roles_constants_1.UserRole.UnimoveAdmin) || user.roles.includes(roles_constants_1.UserRole.UnimoveStoreManager)) {
        console.log("store manager");
        filter = {
            $or: [
                {
                    org_from_id: user.organization_id
                },
                {
                    org_to_id: user.organization_id
                },
                {
                    organization_id: user.organization_id
                }
            ],
            $and: [
                {
                    territory_id: {
                        $in: user.territory_id
                    }
                }
            ]
        };
        return filter;
    }
    else {
        filter = {
            id: "nothing"
        };
        return filter;
    }
}
exports.UnimoveFilter = UnimoveFilter;
//# sourceMappingURL=unimove.filter.js.map