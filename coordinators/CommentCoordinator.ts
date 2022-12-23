import * as borsh from "@project-serum/borsh"
import * as web3 from '@solana/web3.js'
import BN from "bn.js"
import { Comment } from "../models/comment";
import { STUDENT_INTRO_PROGRAM_ID } from "../utils/constants";

export class CommentCoordinator {
    static commentCount: number = 0;

    private static counterLayout = borsh.struct([
        borsh.str('discriminator'),
        borsh.u8('initialized'),
        borsh.u8('count'),
    ])

    static async commentCounterPubkey(
        introduction: web3.PublicKey
    ): Promise<web3.PublicKey> {
        return (
            await web3.PublicKey.findProgramAddress(
                [introduction.toBuffer(), Buffer.from("comment")],
                new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
            )
        )[0]
    }

    static async syncCommentCount(
        connection: web3.Connection,
        introduction: web3.PublicKey
    ) {
        const counterPDA = await this.commentCounterPubkey(introduction);

        try {
            const account = await connection.getAccountInfo(counterPDA)
            this.commentCount = this.counterLayout.decode(account?.data).count
        } catch (error) {
            alert("error while fetching comment counter count");
            console.log(error)
        }
    }

    static async fetchPage(
        connection: web3.Connection,
        introduction: web3.PublicKey,
        pageNo: number,
        perPage: number,
    ): Promise<Comment[]> {
        await this.syncCommentCount(connection, introduction)

        console.log("count", this.commentCount);
        const start = this.commentCount - (perPage * (pageNo - 1));
        const end = Math.max(start - perPage, 0);

        let paginatedPublicKeys: web3.PublicKey[] = []

        for (let i = start; i > end; i--) {
            const [pda] = await web3.PublicKey.findProgramAddress(
                [
                    introduction.toBuffer(),
                    new BN([i]).toArrayLike(Buffer, "be", 8),
                ],
                new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
            )
            paginatedPublicKeys.push(pda)
        }

        const accounts = await connection.getMultipleAccountsInfo(
            paginatedPublicKeys
        )

        const comments = accounts.reduce((accum: Comment[], account) => {
            const comment = Comment.deserialize(account?.data)

            if (!comment) {
                return accum
            }

            return ([...accum, comment])
        }, [])

        return comments
    }
}