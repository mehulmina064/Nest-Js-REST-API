import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors,Res,HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { LocalAuthGuard } from '../authentication/local-auth.guard';
import { AuthenticationService } from '../authentication/authentication.service';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Organization, OrganizationDomain, OrganizationType } from '../organization/organization.entity';
import { UserRole } from './roles.constants';
import { Roles } from '../authentication/roles.decorator';
import { UserCreateDto } from './user.dto';
import { filterAllData, filterSingleObject } from '../common/utils';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthenticationService) {

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() query): Promise<any> {
    return await filterAllData(this.userService,  req.user,query);
  }
   
 @UseGuards(JwtAuthGuard)
  @Get('test1')
  async test1(@Request() req:any) {
    console.log('user-1',req.user);
    return req.user
    return await this.userService.findAll()
  }
  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return await this.userService.findOne(req.user.id);
  }


@Post('setProfilePicture')
@UseGuards(JwtAuthGuard)
async setProfilePicture(@Request() req:any,@Body() data: any) {
  if(!data.profilePicture)
  {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'BAD_REQUEST', 
        message: "Please provide profile picture",
      }, HttpStatus.BAD_REQUEST);
  }
    return await this.userService.setProfilePicture(data.profilePicture,req.user.id);
}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() userData: Partial<User>) {
    return await this.userService.update(req.user.id, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userbyid/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userbyemail/:email')
  async findOneByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  
  @Post('add-user')
  @Roles(UserRole.ADMIN)
  async addUser(@Body() data:User){
    return this.userService.addUser(data);
  }
  
  @Post()
  save(@Body() data:UserCreateDto) {
    let user = new User();
    user.firstName = data.user.firstName;
    user.lastName = data.user.lastName;
    user.email = data.user.email;
    user.contactNumber = data.user.contactNumber;
    user.password = data.user.password;
    user.isVerified=true;
    user.roles = [UserRole.USER, UserRole.ADMIN, UserRole.CLIENT, UserRole.NewUser];
   
    let account = {};
    let organization = new Organization();
    organization.name = data.organization.name;
    organization.type = data.organization.type;
    
    organization.domains = [OrganizationDomain.PROCUREMENT,OrganizationDomain.ECOMMERCE,OrganizationDomain.INVENTORY];
    if(organization.type === OrganizationType.LOGISTICS) {
      //if organization domain includes 'LOGISTIC' then add user role 'LOGISTICS'
      console.log('logistics',organization.type);
      user.roles.push(UserRole.LOGISTICS);
      organization.domains.push(OrganizationDomain.LOGISTICS);
    }
    if(organization.type == OrganizationType.MANUFACTURER) {
      //if organization domain includes 'LOGISTIC' then add user role 'LOGISTICS'
      user.roles.push(UserRole.MANUFACTURER,UserRole.SUPPLIER);
      organization.domains.push(OrganizationDomain.SUPPLIER,OrganizationDomain.MANUFACTURER);
    }
    
    return this.userService.save(user, account, organization);
  
}
  @Get('filter/')
  async filter(@Query() query) {
    return await this.userService.filter(query);
  }
  @Get('userroles')
  async getUserRoles() {
    return await this.userService.getUserRoles();
  }
  // Assign roles to user
  
  @Get('testRole')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() user: User, @Request() req) {
 
    return this.userService.update(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password/:id')
  updatePassword(@Param('id') id: string, @Body() data: any) {
    console.log(data);
    return this.userService.updatePassword(id, data);
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user); 
  }



  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id) {
    return this.userService.remove(id);
  }

  @Post('/forgotpassword')
  async forgotPassword(@Body() data: any) {
    console.log(data);
    return await this.userService.forgotPassword(data.email);

  }
  @Post('/resetpassword')
  async resetPassword(@Body() data: any) {
    return await this.userService.resetPassword(data.email,data.otp, data.password);

  }

  @UseGuards(JwtAuthGuard)
  @Post('verifyOtp')
 async verifyOtp(@Param('contactNumber') contactNumber: string, @Param('otp') otp: string) {
    return this.userService.verifyOtp(contactNumber, otp);
  }
  @UseGuards(LocalAuthGuard)
  @Get('generate-otp/:contactNumber')
  generateOtp(@Param('contactNumber') contactNumber: string) {
    return this.userService.generateOtp(contactNumber);
  }
  @UseGuards(JwtAuthGuard)
  @Post('addrole/:id')
  @Roles(UserRole.ADMIN)
  async addRole(@Param('id') id:string,@Body() data: any) {
    console.log(data.roles);
    return await this.userService.assignRoles(id,data.roles);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-user-to-organization/:id')
  @Roles(UserRole.ADMIN)
  async addUserToOrganization(@Param('id') id:string,@Body() user: User,@Request() req) {
    console.log(user);
    return await this.userService.addUserToOrganization(user,id,req.user);
  }


}

