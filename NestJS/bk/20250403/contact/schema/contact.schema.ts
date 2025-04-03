import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
export const ContactIndex = {
    wui: { wxUnionId: 1 },
}

@Schema({ collection: "Contact" }) // 默认为shops
export class Contact {
    _id: string;
    @Prop({ type: String })
    phone: string;
    @Prop({ type: String })
    wxId: string;
    @Prop({ type: String })
    nickName: string;
    @Prop({ type: String })
    avatarUrl: string;
    @Prop({ type: String })
    wxUnionId: string;
    @Prop({ type: String })
    wxOpenId: string;

    @Prop({
        type: Number, 
        default() {
            return Date.now()
        }
    })
    time: number;
    @Prop({ type: Boolean, default: false })
    sync: boolean;

    constructor(partial: Partial<Contact>) {
        Object.assign(this, partial);
    }
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
Object.values(ContactIndex).forEach(function (composeIndex: any) {
    ContactSchema.index(composeIndex);
})