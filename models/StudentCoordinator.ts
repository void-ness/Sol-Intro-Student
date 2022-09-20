import * as web3 from '@solana/web3.js'
import { StudentIntro } from './StudentIntro'
import bs58 from 'bs58'

const STUDENT_INTRO_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf'

export class StudCoordinator {
    static accounts: web3.PublicKey[] = []

    static async prefetchAccounts(connection: web3.Connection, search: string) {
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID),
            {
                dataSlice: { offset: 1, length: 12 },
                filters: search === '' ? [] : [
                    {
                        memcmp:
                        {
                            offset: 5,
                            bytes: bs58.encode(Buffer.from(search))
                        }
                    }
                ]
            }
        )

        accounts.sort((a, b) => {
            const lengthA = a.account.data.readUInt32LE(0)
            const lengthB = b.account.data.readUInt32LE(0)
            const dataA = a.account.data.slice(4, 4 + lengthA)
            const dataB = b.account.data.slice(4, 4 + lengthB)
            return dataA.compare(dataB)
        })

        this.accounts = accounts.map(account => account.pubkey)
    }

    static async fetchAccounts(connection: web3.Connection, pageNo: number, perPage: number, search: string, reload: boolean): Promise<StudentIntro[]> {
        if (this.accounts.length === 0 || reload) {
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