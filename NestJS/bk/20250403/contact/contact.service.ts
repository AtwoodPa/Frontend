import { Injectable, Logger } from '@nestjs/common';
import { ModelService } from 'src/model/model.service';
import { Contact } from './schema/contact.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateContactDto } from './dto/update.contact.dto';
import { ResourceService } from 'src/resource/resource.service';
import { JwtUserDto } from 'src/auth/dto/jwt.user.dto';
import { RenderContactDto } from './dto/render.contact.dto';
@Injectable()
export class ContactService extends ModelService<Contact> {

    constructor(
        @InjectModel(Contact.name) model: Model<Contact>,
        logger: Logger,
        private readonly resourceService: ResourceService
    ) {
        super(model, logger);
    }
    render(dto: RenderContactDto) {
        let { wxUnionId, ...chainOptions } = dto;
        return this._findOne({ wxUnionId }, chainOptions)
    }
    // render({ wxUnionId }: any, chainOptions: ChainOptions, user: JwtUserDto) {
    //     wxUnionId = wxUnionId || user.unionId;
    //     return this._findOne({ wxUnionId }, chainOptions)
    // }
    async update(dto: UpdateContactDto, user: JwtUserDto) {
        let { phone, wxId, nickName, avatarUrl } = dto;
        let { openId, unionId } = user;
        let update: any = { wxOpenId: openId };
        if (phone) {
            update.phone = phone;
        }
        if (wxId) {
            update.wxId = wxId;
        }
        if (nickName) {
            update.nickName = nickName;
        }
        if (avatarUrl) {
            update.avatarUrl = avatarUrl;
        }
        let rs = await this._upsert({ wxUnionId: unionId }, update);
        await this.resourceService.ifUpdateByContact(dto, unionId)
        return rs;
    }
}
