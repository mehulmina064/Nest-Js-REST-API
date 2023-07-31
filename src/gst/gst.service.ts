// Create Services for GST Entity

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gst } from './gst.entity';
import { HSNCode } from './hsn.entity';
import * as XLSX from 'xlsx';
import { SACCode } from './sac.entity';
@Injectable()
export class GstService {
    

    async findAll(): Promise<Gst[]> {
        return await this.gstRepository.find();
    }

    async findOne(id: string): Promise<any>  {
        
        return await this.gstRepository.findOne(id);
    }

    async save(gst: Gst): Promise<Gst> {
        return await this.gstRepository.save(gst);
    }

    async remove(id: string): Promise<Gst> {
        return await this.gstRepository.remove(id);
    }
    async filter(filter: any) {
        return await this.gstRepository.find(filter);
    }
    async update(id: string, gst: any) {
        return await this.gstRepository.update(id, gst);
    }

    async bulkInsertFromExcelHSNSAC(file: any) {
        let workbook = XLSX.readFile(file.path);
        let sheet_name_list = workbook.SheetNames;
        let xlDataHSN = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        let xlDataSAC = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
        let hsnList:HSNCode[] = [];
        let sacList:SACCode[] = [];
        //HSN Code	HSN Description
        // Map these to HSNCode Entity
        xlDataHSN.forEach(element => {
            let hsn = new HSNCode();
            hsn.hsnCode = element['HSN Code'];
            hsn.description = element['HSN Description'];
            this.hsnCodeRepository.save(hsn);
            console.log(hsn);
            hsnList.push(hsn);
        }
        );
        //SAC Code	SAC Description
        // Map these to SACCode Entity
        xlDataSAC.forEach(element => {
            let sac = new SACCode();
            sac.sacCode = element['SAC Code'];
            sac.description = element['SAC Description'];
            sacList.push(sac);
            this.sacCodeRepository.save(sac);
            console.log(sac);
        }
        );

        return {"message":"success"};


    }
    async bulkInsertFromExcelGST(file: any) {
        let workbook = XLSX.readFile(file.path);
        let sheet_name_list = workbook.SheetNames;
        let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        let gstList:Gst[] = [];
        // HSN Code No.	HSN Code 4 Digit	Name of Commodity	Chapter No.	Sch. GSTRate
        // Map these to GST Entity

        xlData.forEach(element => {

            let gst = new Gst();
            gst.hsnCode = element['HSN Code No.'];
            gst.hsnCode4Digit = element['HSN Code 4 Digit'];
            gst.nameOfCommodity = element['Name of Commodity'];
            gst.chapterNo = element['Chapter No.'];
            gst.schedule = element['Sch.'];
            gst.gstRate = element['GSTRate'];
            gstList.push(gst);
            console.log(gst);
            this.gstRepository.save(gst);
        }
        );
        return {'message':'success'};
    }

    async findByHSNCode(hsnCode: string): Promise<Gst> {
        if ( hsnCode.length == 4 ) {
            return await this.gstRepository.findOne({ where: { hsnCode4Digit: hsnCode } });
        } else {
            // split the string first 4 digit,2 digit and last 2 digit and join them with .
            let queryHSN = hsnCode.substring(0, 4) 
            console.log(queryHSN);
            return await this.gstRepository.findOne({ where: { hsnCode4Digit: queryHSN } });
        }
    }
    async findByHSNCode4Digit(hsnCode4Digit: string): Promise<Gst> {
        return await this.gstRepository.findOne({ where: { hsnCode4Digit: new RegExp(hsnCode4Digit, 'i') } });
    }
    async SearchHSNSACCodeByDescription(description: string): Promise<any> {
        let hsncodes = await this.hsnCodeRepository.find({ where: { description:new RegExp(`${description}`) } });
        let saccodes = await this.sacCodeRepository.find({ where: { description:new RegExp(`${description}`) }  });
        return { 'hsncodes':hsncodes,'saccodes':saccodes};
    }
    async SearchDescriptionFromHsnCode(hsnCode: string): Promise<any> {
        // Create QueryBuilder and search query in HSN and SAC
        let hsn = await this.hsnCodeRepository.find({ where: { hsnCode: new RegExp(`${hsnCode}`) } });
        let sac = await this.sacCodeRepository.find({ where: { sacCode: new RegExp(`${hsnCode}`) } });
        
        return { 'hsncodes':hsn,'saccodes':sac};
    }



    constructor(
        @InjectRepository(Gst)
        private readonly gstRepository: Repository<Gst>,
        @InjectRepository(HSNCode)
        private readonly hsnCodeRepository: Repository<HSNCode>,
        @InjectRepository(SACCode)
        private readonly sacCodeRepository: Repository<SACCode>
    ) { }
}
