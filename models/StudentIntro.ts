import * as borsh from '@project-serum/borsh'

export class StudentIntro {
    name: string;
    message: string;

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('message'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000);
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    constructor(name: string, message: string) {
        this.name = name;
        this.message = message;
    }

    static mocks: StudentIntro[] = [
        new StudentIntro('Rohan Sharma', `The freedom of the blockchain and the transfer of power back into the hands of the community members`),
        new StudentIntro('Tia shaw', `Speed. Accurac. Futuristic. Solana checks all the boxes for me.`),
    ]
}