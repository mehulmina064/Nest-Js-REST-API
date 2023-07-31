import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { prodoRoles, roleStatus } from '../prodoRoles/prodoRoles.entity'; 
import { zohoToken } from '../../sms/token.entity';
import { ProductService } from '../../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'
import { CreateUserRoleDto } from '../prodoRoles/prodoRoles.dto';





@Injectable()
export class zohoDataService {
  constructor(
    @InjectRepository(prodoRoles)
    private readonly prodoRolesRepository: Repository<prodoRoles>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,

) { }


}
