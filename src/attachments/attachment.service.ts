// Create Attachment Service for Attachment Entity ./../attachments/attachment.entity.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { Attachment } from './attachment.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';


export class AttachmentService {
    constructor (
        @InjectRepository(Attachment)
        private readonly attachmentRepository: Repository<Attachment>,
    ) { }

    async findAll(): Promise<Attachment[]> {
        return await this.attachmentRepository.find();
    }

    async findOne(id: string): Promise<Attachment> {
        return await this.attachmentRepository.findOne(id);
    }

    async filter(filter: any) {
        return await this.attachmentRepository.find(filter);
    }

    async update(id: string, attachment: any) {
        return await this.attachmentRepository.update(id, attachment);
    }

    async remove(id: ObjectID | undefined) {
        const attachment = this.attachmentRepository.findOne(id).then(result => {
            this.attachmentRepository.delete(result);
        });
    }

    async save(file, attachment: Attachment, user: any) {
        const s3 = new S3()
        // console.log('upload', file, attachment)

        const uploadedImage = await s3.upload({
            "Bucket": process.env.AWS_S3_BUCKET_NAME,
            "Key": `${uuid()}-${file.originalname}`,
            "Content-Type": file.mimetype,
            "Body": file.buffer,
            "ACL": 'public-read'
            "Inline":true, // required to be false
        }).promise()
        console.log('file',file, attachment, user)
        const newAttachment = new Attachment();        
        newAttachment.fileName = file.originalname;
        newAttachment.filePath = uploadedImage.Location;
        newAttachment.fileType = file.mimetype;
        newAttachment.fileSize = file.size;
        newAttachment.fileUrl = newAttachment.filePath;
        newAttachment.fileExtension = file.originalname.split('.')[1];
        newAttachment.fileMimeType = file.mimetype;
        newAttachment.fileDescription = attachment.fileDescription;
        newAttachment.fileTags = attachment.fileTags;
        newAttachment.fileCategory = attachment.fileCategory;
        newAttachment.fileSubCategory = attachment.fileSubCategory;
        
        console.log('save', newAttachment)
        return await this.attachmentRepository.save(newAttachment);
        
    }


    async findByorganization_id(organization_id: string): Promise<Attachment[]> {
        return await this.attachmentRepository.find({ organization_id: organization_id });
    }

    async findByUserId(user_id: string): Promise<Attachment[]> {
        return await this.attachmentRepository.find({ createdBy: user_id });
    }

}



