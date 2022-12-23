import * as web3 from '@solana/web3.js'
import { StudentIntro } from '../models/StudentIntro'
import bs58 from 'bs58'
import { STUDENT_INTRO_PROGRAM_ID } from '../utils/constants'

export class StudCoordinator {
    static accounts: web3.PublicKey[] = []

    static async prefetchAccounts(connection: web3.Connection, search: string) {
        const offset = (4 + "introduction".length) + 1 + 32 + 4;
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID),
            {
                dataSlice: { offset: 0, length: offset + 20 },
                filters: search === '' ? [
                    {
                        memcmp:
                        {
                            offset: 4,
                            bytes: bs58.encode(Buffer.from("introduction"))
                        }
                    }
                ] : [
                    {
                        memcmp:
                        {
                            offset: offset,
                            bytes: bs58.encode(Buffer.from(search))
                        }
                    }
                ]
            }
        )

        accounts.sort((a, b) => {
            const lengthA = a.account.data.readUInt32LE(offset - 4)
            const lengthB = b.account.data.readUInt32LE(offset - 4)
            const dataA = a.account.data.slice(offset, offset + lengthA)
            const dataB = b.account.data.slice(offset, offset + lengthB)
            return dataA.compare(dataB)
        })

        this.accounts = accounts.map(account => account.pubkey)
    }

    static async fetchAccounts(connection: web3.Connection, pageNo: number, perPage: number, search: string, reload: boolean): Promise<StudentIntro[]> {
        if (this.accounts.length === 0 || reload) {
            console.log("see")
            await this.prefetchAccounts(connection, search)
        }

        const paginatedPublicKeys = this.accounts.slice(
            (pageNo - 1) * perPage,
            pageNo * perPage
        )

        if (paginatedPublicKeys.length === 0) {
            return []
        }

        const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

        // this.accounts.forEach((pubkey) => {
        //     console.log(new web3.PublicKey(pubkey).toString());
        // })

        const students = (accounts).reduce((accum: StudentIntro[], account) => {
            const student = StudentIntro.deserialize(account?.data)

            if (!student) {
                return []
            }

            return [...accum, student]
        }, [])

        return students
    }

}