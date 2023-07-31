import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
// import fetch from 'node-fetch'
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { UserService } from './../users/user.service';
const http = require("https");
// tslint:disable-next-line:no-var-requires
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly TeamRepository: Repository<Team>,
    private readonly mailTriggerService: MailTriggerService,
    private readonly userService: UserService

  ) {}
    async findAll(): Promise<Team[]> {
        return this.TeamRepository.find();
    }
    async findOne(id: string): Promise<Team> {
        return this.TeamRepository.findOne(id);
    }
    async save(team: Team): Promise<Team> {
        //check if team name is already exists
        if (!team.users) {
            team.users = []
        }
        const teamName = await this.TeamRepository.findOne({ name: team.name });
        if (teamName) {
            return Promise.reject(new HttpException('Team name already exists', HttpStatus.BAD_REQUEST));
        }
        else {
             let mails=team.mails
             console.log("mails",mails)
             //check mails have duplicates
             let uniqueMails = team.mails.filter((v, i, a) => a.indexOf(v) === i);
             console.log("un",uniqueMails)
             team.mails=uniqueMails
             //loop on unique mails for check there user exists
                for(let i=0;i<uniqueMails.length;i++){
                    let user = await this.userService.findByEmail(team.mails[i]);
                    if(!user){
                        console.log("user not found")
                        return Promise.reject(new HttpException(`User not found on Mail-${team.mails[i]}`, HttpStatus.BAD_REQUEST));
                    }
                    else {
                        let k=await this.userService.checkTeam(user,team.name)
                        if(k){
                            return Promise.reject(new HttpException(`User ${user.email} already belongs to team ${team.name}`, HttpStatus.BAD_REQUEST));
                        }
                    }
                }
                for(let i=0;i<uniqueMails.length;i++){
                    let user = await this.userService.findByEmail(team.mails[i]);
                    if(user){
                        await this.userService.updateTeam(user,team.name)
                        // user = await this.userService.findByEmail(team.mails[i]);
                        team.users.push(user.email)
                    }
                }
            //  return team
              return await this.TeamRepository.save(team);
        }
    }
    async update(id: string, team: Team): Promise<Team> {
             if(team.mails&&team.users){
                 //You can't able to update mails and users
                    return Promise.reject(new HttpException('You can\'t able to update mails and users', HttpStatus.BAD_REQUEST)); 
                // let mails=team.mails
                // console.log("mails",mails)
                // //check mails have duplicates
                // let uniqueMails = team.mails.filter((v, i, a) => a.indexOf(v) === i);
                // console.log("un",uniqueMails)
                // team.mails=uniqueMails
                // //loop on unique mails for check there user exists
                //    for(let i=0;i<uniqueMails.length;i++){
                //        let user = await this.userService.findByEmail(team.mails[i]);
                //        if(!user){
                //            console.log("user not found")
                //            return Promise.reject(new HttpException(`User not found on Mail-${team.mails[i]}`, HttpStatus.BAD_REQUEST));
                //        }
                //        else {
                //            let k=await this.userService.checkTeam(user,team.name)
                //            if(k){
                //                return Promise.reject(new HttpException(`User ${user.email} already belongs to team ${team.name}`, HttpStatus.BAD_REQUEST));
                //            }
                //        }
                //    }
                //    for(let i=0;i<uniqueMails.length;i++){
                //        let user = await this.userService.findByEmail(team.mails[i]);
                //        if(user){
                //            await this.userService.updateTeam(user,team.name)
                //         //    user = await this.userService.findByEmail(team.mails[i]);
                //            team.users.push(user.email)
                //        }
                //    }
                //    return this.TeamRepository.update(id, team);
             }
             else if (team.name) {
                 const teamName = await this.TeamRepository.findOne({ name: team.name });
                if (!teamName) {
                    return Promise.reject(new HttpException('Team name does not exists', HttpStatus.BAD_REQUEST));
                }
                else {
                    //loop on team.mails
                    let team1 = await this.TeamRepository.findOne({ name: team.name })                
                    let mails=team1.mails
                    for(let i=0;i<mails.length;i++){
                        let user=await this.userService.findByEmail(mails[i])
                            await this.userService.changeTeamName(user,team1.name,team.name)
                        }
                    return this.TeamRepository.update(id, team);
                 }
                }
                else{
                    return this.TeamRepository.update(id, team);
                }   
    }
    async getTeamMembers(id: string): Promise<any> {
        let team=await this.TeamRepository.findOne(id)
        if(team){
            //loop on team.users to get users
            let data=[]
            for(let i=0;i<team.users.length;i++){
                let user = await this.userService.findByEmail(team.users[i]);
                data[i]=user
            }
            return data
        }
        else{
            return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
        }
    }
    async removeMember(id: string,userEmail:string): Promise<void> {
        let team=await this.TeamRepository.findOne(id)
        if(team){
            let user=await this.userService.findByEmail(userEmail)
            if(user){
                await this.userService.removeTeam(user,team.name)
                team.users.splice(team.users.indexOf(user.email),1)
                team.mails.splice(team.users.indexOf(user.email),1)
                await this.TeamRepository.save(team)
            }
          }else{
            return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
            }
    }
    async addMember(id: string,userEmail:string): Promise<void> {
        let team=await this.TeamRepository.findOne(id)
        if(team){
            let user=await this.userService.findByEmail(userEmail)
            console.log("user",user)
            if(user){
                await this.userService.updateTeam(user,team.name)
                team.users.push(user.email)
                team.mails.push(user.email)
                await this.TeamRepository.save(team)
            }
            else {
                return Promise.reject(new HttpException('User not found', HttpStatus.BAD_REQUEST));
            }
            }else{
            return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
            }
    }
    async addBulkMember(id: string,userEmails:string[]): Promise<any> {
        let team=await this.TeamRepository.findOne(id)
        console.log(userEmails)
        if(team){
            for(let i=0;i<userEmails.length;i++){
                let user=await this.userService.findByEmail(userEmails[i])
                // console.log("user o",user) 
                if(user){
                console.log("user",user) 
                    if(await this.userService.checkTeam(user,team.name)){
                        console.log("Allready in team")
                        // return "Allready in team"
                        return Promise.reject(new HttpException(`User ${user.email} already belongs to team ${team.name}`, HttpStatus.BAD_REQUEST));
                    }
                    await this.userService.updateTeam(user,team.name)
                    team.users.push(user.email)
                    team.mails.push(user.email)
                }
                else {
                // console.log("user not ",user) 

                    return Promise.reject(new HttpException(`User ${userEmails[i]} not registered on prodo website ${team.name}`, HttpStatus.BAD_REQUEST));
                }
            }
            return await this.TeamRepository.save(team)
            
            }else{
                console.log("team not found")
                // return "team not found"
            return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
            }
    }

    async removeBulkMember(id: string,userEmails:string[]): Promise<void> {
        let team=await this.TeamRepository.findOne(id)
        if(team){
            for(let i=0;i<userEmails.length;i++){
                let user=await this.userService.findByEmail(userEmails[i])
                if(user){
                    await this.userService.removeTeam(user,team.name)
                    team.users.splice(team.users.indexOf(user.email),1)
                    team.mails.splice(team.users.indexOf(user.email),1)
                }
            }
            await this.TeamRepository.save(team)
            }else{
            return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
            }
    }
    async remove(id: string): Promise<void> {
        let team = await this.TeamRepository.findOne(id); 
        await this.mailTriggerService.removeTeamFromAll(team.name)
        if(team){
            // await this.userService.removeTeam(team.users[i],team.name)
            for(let i=0;i<team.users.length;i++){
                let user = await this.userService.findByEmail(team.users[i]);
                await this.userService.removeTeam(user,team.name)
            }
        await this.TeamRepository.delete(id);
       }
       else{
            return Promise.reject(new HttpException('Team not found', HttpStatus.BAD_REQUEST));
       }
       
    } 

}
