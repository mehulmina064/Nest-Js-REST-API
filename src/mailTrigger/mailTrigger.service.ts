import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import {MailTrigger} from './mailTrigger.entity';
import { MailService } from './../mail/mail.service';
import { Team } from './../team/team.entity';
// import { TeamService } from './../team/team.service';
import {HttpException,HttpStatus } from '@nestjs/common';



@Injectable()
export class MailTriggerService {
    constructor(
        @InjectRepository(MailTrigger)
        private readonly MailTriggerRepository: Repository<MailTrigger>,
        private readonly mailService: MailService,
        // private readonly teamService: TeamService,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
    ) {}
        async findAll(): Promise<MailTrigger[]> {
            return this.MailTriggerRepository.find();
        }
        // async addAdminTeam(){
        //     let team="Demo"
        //     let triggers= await this.MailTriggerRepository.find();
        //     for(let i=0;i<triggers.length;i++){
        //         let trigger = await this.findOne(triggers[i].id);
        //         // console.log(trigger);
        //         trigger.teams.push(team)
        //         await this.save(trigger)
        //     }
        //     return await this.MailTriggerRepository.find();
        // }
        async findOne(id: string): Promise<MailTrigger> {
            return this.MailTriggerRepository.findOne(id);
        }
        async save(mailTrigger: MailTrigger): Promise<MailTrigger> {
            return this.MailTriggerRepository.save(mailTrigger);
        }
        async update(id: string, mailTrigger: MailTrigger): Promise<MailTrigger> {
            return this.MailTriggerRepository.update(id, mailTrigger);
        }
        async remove(id: string): Promise<void> {
            await this.MailTriggerRepository.delete(id);
        }
        async findByName(name: string): Promise<MailTrigger> {
            return this.MailTriggerRepository.find({where: {name: name}});
        }

        async SendMail(Data: any){
            console.log("mailTrigger service-")
            let trigger = await this.findByName(Data.TriggerName);            
            if(!trigger){
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Trigger not found',
                    message: "Trigger not found"
                  }, HttpStatus.FORBIDDEN); 
            }
            trigger.forEach(async trigger => {
                if(trigger.type == "USER"){
                    let mail = Data.doc.email;
                    let subject = ""
                    subject+=trigger.subject.text1
                    if(trigger.templatevars.subjectVar.var1&&(trigger.templatevars.subjectVar.var1!="")){
                        subject+=" "
                        subject+=Data.doc[trigger.templatevars.subjectVar.var1]
                        subject+=" "
                    }
                    subject+=trigger.subject.text2
                    if(trigger.templatevars.subjectVar.var2&&(trigger.templatevars.subjectVar.var2!="")){
                        subject+=" "
                        subject+=Data.doc[trigger.templatevars.subjectVar.var2]
                        subject+=" "
                    }
                    subject+=trigger.subject.text3
                    let MailTriggerU = {
                        from: trigger.from,
                        mails: mail,
                        subject: subject,
                        template: trigger.templateName,
                        templatevars: Data.templatevars
                    }
                    console.log(MailTriggerU);
                    this.mailService.sendMailTeam(MailTriggerU);
                }
                else {
                    let TeamName= trigger.teams.map(team => team);
                    // console.log(Data);
                    let mails=""
                    for(let i=0;i<TeamName.length;i++){
                        let team = await this.teamRepository.findOne({where: {name: TeamName[i]}});
                        mails+=team.mails
                    }
                    let subject=""
                    subject+=trigger.subject.text1
                    if(trigger.templatevars.subjectVar.var1&&(trigger.templatevars.subjectVar.var1!="")){
                        subject+=" "
                        subject+=Data.doc[trigger.templatevars.subjectVar.var1]
                        subject+=" "
                    }
                    subject+=trigger.subject.text2
                    if(trigger.templatevars.subjectVar.var2&&(trigger.templatevars.subjectVar.var2!="")){
                        subject+=" "
                        subject+=Data.doc[trigger.templatevars.subjectVar.var2]
                        subject+=" "
                    }
                    subject+=trigger.subject.text3
                    // subject+=trigger.subject.text1+" "+Data.doc[trigger.templatevars.subjectVar.var1]+" "+trigger.subject.text2+" "+Data.doc[trigger.templatevars.subjectVar.var2]+" "+trigger.subject.text3;
                    let mailTrigger = {
                        from: trigger.from,
                        mails: mails,
                        subject: subject,
                        template: trigger.templateName,
                        templatevars:Data.templatevars
                    };
                    console.log(mailTrigger);
                    this.mailService.sendMailTeam(mailTrigger);
                    }
            });
        }
    async getTeams(id: string): Promise<Team[]> {
        let trigger = await this.findOne(id);
        let teams = trigger.teams
        let data = []
        for(let i=0;i<teams.length;i++){
            let team = await this.teamRepository.findOne({where: {name: teams[i]}});
            data[i] = team
        }
        return data
    }
    async removeTeam(id: string, team: string): Promise<void> {
        let trigger = await this.findOne(id);
        let teams = trigger.teams
        let index = teams.indexOf(team)
        teams.splice(index,1)
        trigger.teams = teams
        await this.save(trigger)
    }
    async addTeam(id: string, team: string): Promise<void> {
        let trigger = await this.findOne(id);
        let teams = trigger.teams
        teams.push(team)
        trigger.teams = teams
        await this.save(trigger)
    }
    async addBulkTeams(id: string, teams: string[]): Promise<void> {
        let trigger = await this.findOne(id);
        let teams2 = trigger.teams
        teams2 = teams2.concat(teams)
        let team = teams2.filter((v, i, a) => a.indexOf(v) === i);
        trigger.teams = team
        await this.save(trigger)
    }
    async removeBulkTeams(id: string, teams: string[]): Promise<void> {
        let trigger = await this.findOne(id);
        let teams2 = trigger.teams
        for(let i=0;i<teams.length;i++){
            let index = teams2.indexOf(teams[i])
            teams2.splice(index,1)
        }
        trigger.teams = teams2
        await this.save(trigger)
    }
    async removeTeamFromAll(team: string): Promise<void> {
        let triggers = await this.findAll();
        for(let i=0;i<triggers.length;i++){
            let teams = triggers[i].teams
            let index = teams.indexOf(team)
            teams.splice(index,1)
            triggers[i].teams = teams
            await this.save(triggers[i])
        }
    }
 }
