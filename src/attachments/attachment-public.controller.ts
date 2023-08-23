import { filterAllData } from '../common/utils';
// import { JwtAuthGuard } from './../authentication/jwt-auth.guard';
import { Req, UseGuards } from '@nestjs/common';
// Create Controller for Attachment Service

import { Body, Controller, Get, Param, Post,Res, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AttachmentService } from "./attachment.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName } from "../files/file.utils";
import { Attachment } from "./attachment.entity";

// @UseGuards(JwtAuthGuard)
@Controller('attachments-public')
export class AttachmentPublicController {
    constructor(private readonly attachmentService: AttachmentService) { }
@Get()
async findAll(@Request() req) {
    return filterAllData(this.attachmentService, req.user);
}
@Post()
// @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './attachments',
//         filename: editFileName,
//       }),
//     }),
//   )
@UseInterceptors(FileInterceptor('file'))
async save(@UploadedFile() file:any, @Body() attachment: Attachment, @Request() req) {
    return await this.attachmentService.save(file, attachment, req.user);

  }
@Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res, @Request() req) {
    if (image ) {
      res.sendFile(image, { root: './attachments' });
    }
    return {
      message: 'Image not found!',
    };
  }




}