import { FC } from 'react'
import { StudentIntro } from '../models/StudentIntro'
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'
import * as web3 from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

// const STUDENT_INTRO_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf'
const STUDENT_INTRO_PROGRAM_ID = '92HR2ghpZJFKt6XdQfGW5ZMyLuEXjZo1YBrq49x1w1nV'

export const Form: FC = () => {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const studentIntro = new StudentIntro(name, message)
        handleTransactionSubmit(studentIntro)
    }

    const handleTransactionSubmit = async (studentIntro: StudentIntro) => {
        // console.log(studentIntro.name, studentIntro.message)
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }

        const buffer = studentIntro.serialize()
        const transaction = new web3.Transaction()

        const [pda] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
        )

        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: true
                }
            ],
            data: buffer,
            programId: new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
        })

        transaction.add(instruction)

        try {
            let txid = await sendTransaction(transaction, connection)
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)

        } catch (e) {
            console.log(JSON.stringify(e))
        }
    }

    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            // borderWidth={1}
            margin={0}
            mt={4}
            width={{ base: '100%', md: "90%" }}
            justifyContent="left"
            // bgGradient={'linear(to-tr,#9249fb,#5597d9,#21efa5)'}
            bgGradient={'linear(to-tr,purple.400 20%, blue.400, green.300)'}
            borderRadius="2xl"
            boxShadow={'dark-lg'}
        >
            <form onSubmit={handleSubmit} style={{ width: "90%" }}>
                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        What do we call you?
                    </FormLabel>
                    <Input
                        id='name'
                        color='gray.200'
                        onChange={event => setName(event.currentTarget.value)}
                    />
                </FormControl>
                <FormControl isRequired mt={4}>
                    <FormLabel color='gray.200'>
                        Describe yourself in under 1 line
                    </FormLabel>
                    <Textarea
                        id='message'
                        color='gray.200'
                        onChange={event => setMessage(event.currentTarget.value)}
                    />
                </FormControl>
                <Button width="full" mt={4} type="submit">
                    Submit
                </Button>
            </form>
        </Box>
    );
}