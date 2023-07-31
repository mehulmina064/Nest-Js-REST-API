import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientData } from "./client-data.entity";
import { ClientDataService } from "./client-data.service";
import { ClientDataController } from "./client-data.controller";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        AuthenticationModule,
        TypeOrmModule.forFeature([ClientData]),
        PassportModule
    ],
    providers: [ClientDataService],
    controllers: [ClientDataController],
    exports: [ClientDataService],

})
export class ClientDataModule {}
