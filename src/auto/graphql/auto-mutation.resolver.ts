import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { type CreateError, type UpdateError } from '../service/errors.js';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { type Auto } from '../entity/auto.entity.js';
import { AutoWriteService } from '../service/auto-write.service.js';
import { type IdInput } from './auto-query.resolver.js';
import { JwtAuthGraphQlGuard } from '../../security/auth/jwt/jwt-auth-graphql.guard.js';
import { type Kategorie } from '../entity/kategorie.entity.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { Roles } from '../../security/auth/roles/roles.decorator.js';
import { RolesGraphQlGuard } from '../../security/auth/roles/roles-graphql.guard.js';
import { UserInputError } from 'apollo-server-express';
import { getLogger } from '../../logger/logger.js';

type AutoCreateDTO = Omit<
    Auto,
    'aktualisiert' | 'erzeugt' | 'id' | 'kategorien' | 'version'
> & { kategorien: string[] };
type AutoUpdateDTO = Omit<Auto, 'aktualisiert' | 'erzeugt' | 'kategorien'>;

// Authentifizierung und Autorisierung durch
//  GraphQL Shield
//      https://www.graphql-shield.com
//      https://github.com/maticzav/graphql-shield
//      https://github.com/nestjs/graphql/issues/92
//      https://github.com/maticzav/graphql-shield/issues/213
//  GraphQL AuthZ
//      https://github.com/AstrumU/graphql-authz
//      https://www.the-guild.dev/blog/graphql-authz

@Resolver()
// alternativ: globale Aktivierung der Guards https://docs.nestjs.com/security/authorization#basic-rbac-implementation
@UseGuards(JwtAuthGraphQlGuard, RolesGraphQlGuard)
@UseInterceptors(ResponseTimeInterceptor)
export class AutoMutationResolver {
    readonly #service: AutoWriteService;

    readonly #logger = getLogger(AutoMutationResolver.name);

    constructor(service: AutoWriteService) {
        this.#service = service;
    }

    @Mutation()
    @Roles('admin', 'mitarbeiter')
    async create(@Args('input') autoDTO: AutoCreateDTO) {
        this.#logger.debug('create: autoDTO=%o', autoDTO);

        const result = await this.#service.create(this.#dtoToAuto(autoDTO));
        this.#logger.debug('createAuto: result=%o', result);

        if (Object.prototype.hasOwnProperty.call(result, 'type')) {
            // UserInputError liefert Statuscode 200
            throw new UserInputError(
                this.#errorMsgCreateAuto(result as CreateError),
            );
        }
        return result;
    }

    @Mutation()
    @Roles('admin', 'mitarbeiter')
    async update(@Args('input') auto: AutoUpdateDTO) {
        this.#logger.debug('update: auto=%o', auto);
        const versionStr = `"${auto.version?.toString()}"`;

        const result = await this.#service.update(
            auto.id,
            auto as Auto,
            versionStr,
        );
        if (typeof result === 'object') {
            throw new UserInputError(this.#errorMsgUpdateAuto(result));
        }
        this.#logger.debug('updateAuto: result=%d', result);
        return result;
    }

    @Mutation()
    @Roles('admin')
    async delete(@Args() id: IdInput) {
        const idStr = id.id;
        this.#logger.debug('delete: id=%s', idStr);
        const result = await this.#service.delete(idStr);
        this.#logger.debug('deleteAuto: result=%s', result);
        return result;
    }

    #dtoToAuto(autoDTO: AutoCreateDTO): Auto {
        const auto: Auto = {
            id: undefined,
            version: undefined,
            modell: autoDTO.modell,
            ps: autoDTO.ps,
            art: autoDTO.art,
            hersteller: autoDTO.hersteller,
            preis: autoDTO.preis,
            rabatt: autoDTO.rabatt,
            lieferbar: autoDTO.lieferbar,
            datum: autoDTO.datum,
            modellnummer: autoDTO.modellnummer,
            homepage: autoDTO.homepage,
            kategorien: [],
            erzeugt: undefined,
            aktualisiert: undefined,
        };

        autoDTO.kategorien.forEach((s) => {
            const kategorie: Kategorie = {
                id: undefined,
                kategorie: s,
                auto,
            };
            auto.kategorien.push(kategorie);
        });

        return auto;
    }

    #errorMsgCreateAuto(err: CreateError) {
        switch (err.type) {
            case 'ConstraintViolations':
                return err.messages.join(' ');
            case 'ModellExists':
                return `Der Modell "${err.modell}" existiert bereits`;
            case 'ModellnummerExists':
                return `Die MODELLNUMMER ${err.modellnummer} existiert bereits`;
            default:
                return 'Unbekannter Fehler';
        }
    }

    #errorMsgUpdateAuto(err: UpdateError) {
        switch (err.type) {
            case 'ConstraintViolations':
                return err.messages.join(' ');
            case 'ModellExists':
                return `Der Modell "${err.modell}" existiert bereits`;
            case 'AutoNotExists':
                return `Es gibt kein Auto mit der ID ${err.id}`;
            case 'VersionInvalid':
                return `"${err.version}" ist keine gueltige Versionsnummer`;
            case 'VersionOutdated':
                return `Die Versionsnummer "${err.version}" ist nicht mehr aktuell`;
            default:
                return 'Unbekannter Fehler';
        }
    }
}
