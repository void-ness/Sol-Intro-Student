import * as borsh from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js"
import BN from "bn.js"
import { STUDENT_INTRO_PROGRAM_ID } from "../utils/constants";

export class Comment {
    introduction: PublicKey;
    commenter: PublicKey;
    comment: string;
    count: number;

    constructor(
        introduction: PublicKey,
        commenter: PublicKey,
        comment: string,
        count: number
    ) {
        this.introduction = introduction;
        this.commenter = commenter;
        this.comment = comment;
        this.count = count;
    }

    async publicKey(): Promise<PublicKey> {
        return (await PublicKey.findProgramAddress(
            [
                this.introduction.toBuffer(),
                new BN(this.count).toArrayLike(Buffer, "be", 8),
            ],
            new PublicKey(STUDENT_INTRO_PROGRAM_ID)
        ))[0]
    }

    private borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('comment')
    ])

    private static borshAccountSchema = borsh.struct([
        borsh.str("discriminator"),
        borsh.bool("initialized"),
        borsh.publicKey("introduction"),
        borsh.publicKey("commenter"),
        borsh.str("comment"),
        borsh.u8("count"),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 2 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): Comment | null {
        if (!buffer) {
            return null
        }

        try {
            const { introduction, commenter, comment, count } = this.borshAccountSchema.decode(buffer)
            return new Comment(introduction, commenter, comment, count)
        } catch (e) {
            console.log("Deserialization error", e)
            console.log(buffer)
            return null
        }
    }
}