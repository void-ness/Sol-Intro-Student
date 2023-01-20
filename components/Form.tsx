import { FC } from 'react'
import { StudentIntro } from '../models/StudentIntro'
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, HStack, Input, Switch, Text, Textarea } from '@chakra-ui/react'
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { RPC_URL, STUDENT_INTRO_PROGRAM_ID } from '../utils/constants'

export const Form: FC = () => {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [updateToggle, setUpdateToggle] = useState(false)

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = (event: any) => {
        event.preventDefault()

        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }

        const studentIntro = new StudentIntro(name, message, publicKey)
        handleTransactionSubmit(studentIntro)
    }

    const handleTransactionSubmit = async (studentIntro: StudentIntro) => {
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }

        const programId = new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID);

        const buffer = studentIntro.serialize(updateToggle ? 1 : 0)
        const transaction = new web3.Transaction()

        const [pda] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
        )

        const [pda_counter] = await web3.PublicKey.findProgramAddress(
            [pda.toBuffer(), Buffer.from("comment")],
            new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
        )

        const [token_mint] = await web3.PublicKey.findProgramAddress([Buffer.from("token_mint")], programId);
        const [mint_auth] = await web3.PublicKey.findProgramAddress([Buffer.from("token_auth")], programId);
        const user_ata = await token.getAssociatedTokenAddress(token_mint, publicKey,);

        const ataAccount = await connection.getAccountInfo(user_ata);

        if (!ataAccount) {
            const ataInstruction = token.createAssociatedTokenAccountInstruction(
                publicKey,
                user_ata,
                publicKey,
                token_mint
            )

            transaction.add(ataInstruction)
        }

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
                    pubkey: pda_counter,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: token_mint,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: mint_auth,
                    isSigner: false,
                    isWritable: false
                },
                {
                    pubkey: user_ata,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                },
                {
                    pubkey: token.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false
                },
            ],
            data: buffer,
            programId: programId
        })

        transaction.add(instruction)

        try {
            let txid = await sendTransaction(transaction, connection)
            alert("Transaction submitted successfully")
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=${RPC_URL}`)

        } catch (e) {
            alert(JSON.stringify(e))
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
                        onChange={event => setName(event.currentTarget.value.toLowerCase())}
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
                <FormControl mt={4}>
                    <HStack>
                        <FormLabel color={"gray.200"} m={0}>
                            Update
                        </FormLabel>
                        <Switch onChange={(event) => {
                            setUpdateToggle(!updateToggle)
                        }} colorScheme='purple' size={'sm'} />
                    </HStack>
                </FormControl>
                <Button width="full" mt={6} type="submit">
                    Submit
                </Button>
            </form>
        </Box>
    );
}