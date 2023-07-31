import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { rolesPermissionGroupService } from '../prodoPermissionAndGroup/rolesPermission.service';
import { userRolesService } from '../prodoRoles/userRoles.service';
import { prodoPermissionService } from '../prodoPermissionAndGroup/prodoPermission.service';
export declare class roleMiddleware implements NestMiddleware {
    private readonly zohoEmployeeService;
    private readonly rolesPermissionGroupService;
    private readonly userRolesService;
    private readonly prodoPermissionService;
    constructor(zohoEmployeeService: zohoEmployeeService, rolesPermissionGroupService: rolesPermissionGroupService, userRolesService: userRolesService, prodoPermissionService: prodoPermissionService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
