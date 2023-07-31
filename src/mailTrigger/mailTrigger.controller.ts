import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, DefaultValuePipe, ParseIntPipe, Query,Request  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './../team/team.entity';
import { get } from 'superagent';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { MailTrigger } from './mailTrigger.entity';
import { MailTriggerService } from './mailTrigger.service';
import { MailService } from './../mail/mail.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { ObjectID, FindConditions, Repository, FindManyOptions, getRepository } from 'typeorm';
import { Data } from 'ejs';

@Controller('MailTrigger')
export class MailTriggerController {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        private readonly mailTriggerService: MailTriggerService,
        private readonly mailService: MailService
        ) 
    { }
   
    @Get()
    findAll(): Promise<MailTrigger[]> {
        console.log("mailTrigger in controller-")
        return this.mailTriggerService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.mailTriggerService.findOne(id);
    }
    @Post()
    save(@Body() mailTrigger: MailTrigger) {
        return this.mailTriggerService.save(mailTrigger);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() mailTrigger: MailTrigger) {
        return this.mailTriggerService.update(id, mailTrigger);
    }
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.mailTriggerService.remove(id);
    }

    @Get('/:id/Teams')
    findMembers(@Param('id') id: string) {
        return this.mailTriggerService.getTeams(id);
    }
    @Delete('/:id/Teams/:teamName')
    removeMember(@Param('id') id: string, @Param('teamName') teamName: string) {
        return this.mailTriggerService.removeTeam(id, teamName);
    }
    @Post('/:id/Teams')
    addMember(@Param('id') id: string, @Body() teamId: string) {
        return this.mailTriggerService.addTeam(id, teamId);
    }
    @Post('/:id/Teams/addBulk')
    addMembers(@Param('id') id: string, @Body() teamIds: string[]) {
        return this.mailTriggerService.addBulkTeams(id, teamIds);
    }
    @Post('/:id/Teams/removeBulk')
    removeMembers(@Param('id') id: string, @Body() teamIds: string[]) {
        return this.mailTriggerService.removeBulkTeams(id, teamIds);
    }
   
    // @Get('TEST')
    // TEST(){
    //     // return 
    //     console.log("TESTING")
    //     let t="TESTING"
    //     return t;
    // }
    //add new teams to mailtrigger.teams
    // @Post('/:id/addTeams')
    // async addTeams(@Param('id') id: string, @Body() teams: Team[]) {
    //     let mailTrigger = await this.mailTriggerService.findOne(id);
    //     mailTrigger.teams = teams;
    //     return this.mailTriggerService.save(mailTrigger);
    // }
    
    // @Post('sendMail')
    // async sendMail(@Body() Data: Data) {
    //     console.log("mailTrigger in controller-")
    //     let trigger = await this.mailTriggerService.findByName(Data.TriggerName);
    //     // let TeamName= trigger.teams.map(team => team);
    //     console.log(trigger);
    //     trigger.forEach(async trigger => {
    //         // if(trigger.type == "USER"){
    //         //     let mail = Data.doc.email;
    //         //     let subject = ""
    //         //     subject+=trigger.subject.text1
    //         //     if(trigger.templatevars.subjectVar.var1&&(trigger.templatevars.subjectVar.var1!="")){
    //         //         subject+=" "
    //         //         subject+=Data.doc[trigger.templatevars.subjectVar.var1]
    //         //         subject+=" "
    //         //     }
    //         //     subject+=trigger.subject.text2
    //         //     if(trigger.templatevars.subjectVar.var2&&(trigger.templatevars.subjectVar.var2!="")){
    //         //         subject+=" "
    //         //         subject+=Data.doc[trigger.templatevars.subjectVar.var2]
    //         //         subject+=" "
    //         //     }
    //         //     subject+=trigger.subject.text3
    //         //     let MailTrigger = {
    //         //         from: trigger.from,
    //         //         mails: mail,
    //         //         subject: subject,
    //         //         templatevars: Data.templatevars
    //         //     }

    //         // }
    //         // else {
    //             let TeamName= trigger.teams.map(team => team);
    //             // console.log(Data);
    //             let mails=""
    //             for(let i=0;i<TeamName.length;i++){
    //                 let team = await this.teamRepository.findOne({where: {name: TeamName[i]}});
    //                 mails+=team.mails
    //             }
    //             let subject=""
    //             subject+=trigger.subject.text1
    //             if(trigger.templatevars.subjectVar.var1&&(trigger.templatevars.subjectVar.var1!="")){
    //                 subject+=" "
    //                 subject+=Data.doc[trigger.templatevars.subjectVar.var1]
    //                 subject+=" "
    //             }
    //             subject+=trigger.subject.text2
    //             if(trigger.templatevars.subjectVar.var2&&(trigger.templatevars.subjectVar.var2!="")){
    //                 subject+=" "
    //                 subject+=Data.doc[trigger.templatevars.subjectVar.var2]
    //                 subject+=" "
    //             }
    //             subject+=trigger.subject.text3
    //             // subject+=trigger.subject.text1+" "+Data.doc[trigger.templatevars.subjectVar.var1]+" "+trigger.subject.text2+" "+Data.doc[trigger.templatevars.subjectVar.var2]+" "+trigger.subject.text3;
    //             let mailTrigger = {
    //                 from: trigger.from,
    //                 mails: mails,
    //                 subject: subject,
    //                 template: trigger.templateName,
    //                 templatevars:Data.templatevars
    //             };
    //             console.log(mailTrigger);
    //             return this.mailService.sendMailTeam(mailTrigger);
    //             }
    //     // }
    //     );


        
    // }
  
 
 
}
