import { AuthModule } from '../security/auth/auth.module.js';
import { Auto } from './entity/auto.entity.js';
import { AutoGetController } from './rest/auto-get.controller.js';
import { AutoMutationResolver } from './graphql/auto-mutation.resolver.js';
import { AutoQueryResolver } from './graphql/auto-query.resolver.js';
import { AutoReadService } from './service/auto-read.service.js';
import { AutoValidationService } from './service/auto-validation.service.js';
import { AutoWriteController } from './rest/auto-write.controller.js';
import { AutoWriteService } from './service/auto-write.service.js';
import { Kategorie } from './entity/kategorie.entity.js';
import { MailModule } from '../mail/mail.module.js';
import { Module } from '@nestjs/common';
import { QueryBuilder } from './service/query-builder.js';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Das Modul besteht aus Controller- und Service-Klassen für die Verwaltung von
 * Bücher.
 * @packageDocumentation
 */

/**
 * Die dekorierte Modul-Klasse mit Controller- und Service-Klassen sowie der
 * Funktionalität für TypeORM.
 */
@Module({
    imports: [
        MailModule,
        // siehe auch src\app.module.ts
        TypeOrmModule.forFeature([Auto, Kategorie]),
        AuthModule,
    ],
    controllers: [AutoGetController, AutoWriteController],
    // Provider sind z.B. Service-Klassen fuer DI
    providers: [
        AutoReadService,
        AutoWriteService,
        AutoValidationService,
        AutoQueryResolver,
        AutoMutationResolver,
        QueryBuilder,
    ],
    // Export der Provider fuer DI in anderen Modulen
    exports: [AutoReadService, AutoWriteService, AutoValidationService],
})
export class AutoModule {}
