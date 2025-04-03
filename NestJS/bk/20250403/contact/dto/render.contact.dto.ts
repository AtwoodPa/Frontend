import { IsNotEmpty, IsString } from "class-validator";
import { ChainOptions } from "src/model/dto/chain-options.dto";

export class RenderContactDto extends ChainOptions {
    @IsString()
    @IsNotEmpty()
    wxUnionId: string;
}