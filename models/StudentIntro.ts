import * as borsh from '@project-serum/borsh'
import { PublicKey } from '@solana/web3.js';
import { STUDENT_INTRO_PROGRAM_ID } from '../utils/constants';

export class StudentIntro {
    name: string;
    message: string;
    reviewer: PublicKey;

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('message'),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.str('discriminator'),
        borsh.u8('initialized'),
        borsh.publicKey('reviewer'),
        borsh.str('name'),
        borsh.str('message'),
    ])

    serialize(variant: number): Buffer {
        const buffer = Buffer.alloc(1000);
        this.borshInstructionSchema.encode({ ...this, variant: variant }, buffer);
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): StudentIntro | null {
        if (!buffer) {
            return null
        }

        try {
            const { name, message, reviewer } = this.borshAccountSchema.decode(buffer)
            console.log(reviewer.toString())
            return new StudentIntro(name, message, reviewer)
        } catch (e) {
            console.log("error while deserialzing", e)
            console.log(buffer)
            return null
        }
    }

    constructor(name: string, message: string, reviewer: PublicKey) {
        this.name = name;
        this.message = message;
        this.reviewer = reviewer;
    }

    async publicKey(): Promise<PublicKey> {
        return (await PublicKey.findProgramAddress(
            [this.reviewer.toBuffer()], new PublicKey(STUDENT_INTRO_PROGRAM_ID)
        ))[0]
    }

    static mocks: StudentIntro[] = [
        new StudentIntro('Rohan Sharma', `The freedom of the blockchain and the transfer of power back into the hands of the community members`, new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")),
        new StudentIntro('Tia shaw', `Speed. Accurac. Futuristic. Solana checks all the boxes for me.`, new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")),
    ]
}