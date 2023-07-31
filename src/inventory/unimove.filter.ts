import { UserRole } from './../users/roles.constants';
import { User } from './../users/user.entity';
export function UnimoveFilter(user:User) {
    console.log('filter',user);
    let filter = {};

    if (user.roles.includes(UserRole.UnimoveSuperAdmin) || user.roles.includes(UserRole.ADMIN)) {
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
    else if (user.roles.includes(UserRole.UnimoveAdmin) || user.roles.includes(UserRole.UnimoveStoreManager)) {
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
            id:"nothing"
        };
        return filter;
    }
    
    
                
   
    
}