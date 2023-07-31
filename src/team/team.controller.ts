import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe, Query  } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { TeamService } from './team.service';
import { Team } from './team.entity';

@Controller('teams')
export class TeamController {
    constructor(private readonly teamService: TeamService) {
    }

    @Get()
    findAll(): Promise<Team[]> {
        return this.teamService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.teamService.findOne(id);
    }
    @Post()
    save(@Body() team: Team) {
        return this.teamService.save(team);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() team: Team) {
        return this.teamService.update(id, team);
    }
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.teamService.remove(id);
    }

    @Get('/:id/members')
    findMembers(@Param('id') id: string) { 
        return this.teamService.getTeamMembers(id);
    }
    
    @Delete('/:id/members/:memberEmail')
    removeMember(@Param('id') id: string, @Param('memberEmail') memberEmail: string) {
        return this.teamService.removeMember(id, memberEmail);
    }

    @Post('/:id/members')
    addMember(@Param('id') id: string, @Body() memberEmail: string) {
        console.log(memberEmail);
        return this.teamService.addMember(id, memberEmail);
    }

    @Post('/:id/members/addBulk')
    async addMembers(@Param('id') id: string, @Body() members: string[]) { 
        let k= await this.teamService.addBulkMember(id, members);
        console.log(k)
        return k
    }
    @Post('/:id/members/removeBulk')
    removeMembers(@Param('id') id: string, @Body() members: string[]) {
        return this.teamService.removeBulkMember(id, members); 
    }

 
}
