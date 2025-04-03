import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ChainOptions } from 'src/model/dto/chain-options.dto';
import { UpdateContactDto } from './dto/update.contact.dto';
import { JwtAuthGuard } from 'src/annotation/guard/jwt.auth.guard';
import { JwtUserDto } from 'src/auth/dto/jwt.user.dto';
import { JwtUserGuard } from 'src/annotation/guard/jwt.user.guard';
import { RenderContactDto } from './dto/render.contact.dto';
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post('getCurrent')
    @UseGuards(JwtUserGuard)
    getCurrent(@Body() options: ChainOptions, @Req() req) {
        let user: JwtUserDto = req.user;
        let { unionId } = user;
        return this.contactService._findOne({ wxUnionId: unionId }, options)
    }

    @Post('updateCurrent')
    @UseGuards(JwtAuthGuard)
    updateCurrent(@Body() dto: UpdateContactDto, @Req() req) {
        let user: JwtUserDto = req.user;
        return this.contactService.update(dto, user)
    }

    @Post('render')
    @UseGuards(JwtAuthGuard)
    render(@Body() dto: RenderContactDto) {
        return this.contactService.render(dto)
    }
}
