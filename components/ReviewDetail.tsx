import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { FC, useState } from "react"
import { CommentCoordinator } from "../coordinators/CommentCoordinator"
import { Comment } from "../models/comment"
import { StudentIntro } from "../models/StudentIntro"
import { CommentList } from "./CommentList"

import * as web3 from "@solana/web3.js"
import { STUDENT_INTRO_PROGRAM_ID } from "../utils/constants"


interface ReviewDetailProps {
    isOpen: boolean
    onClose: any
    intro: StudentIntro
}

export const ReviewDetail: FC<ReviewDetailProps> = ({
    isOpen,
    onClose,
    intro
}: ReviewDetailProps) => {
    const [comment, setComment] = useState("");
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = (event: any) => {
        event.preventDefault()

        if (!publicKey) {
            alert("Please connect your wallet")
            return
        }

        intro.publicKey().then(async (review) => {
            await CommentCoordinator.syncCommentCount(connection, review)
            return review
        }).then((review) => {
            const userComment = new Comment(
                review,
                publicKey,
                comment,
                CommentCoordinator.commentCount
            )

            handleTransactionSubmit(userComment)
        })
    }

    const handleTransactionSubmit = async (comment: Comment) => {
        if (!publicKey) {
            return
        }

        const buffer = comment.serialize()
        const transaction = new web3.Transaction()

        const pda = await comment.publicKey();
        const counter = await CommentCoordinator.commentCounterPubkey(
            comment.introduction
        )

        // const account = await connection.getAccountInfo(counter)

        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: comment.introduction,
                    isSigner: false,
                    isWritable: false
                },
                {
                    pubkey: counter,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            data: buffer,
            programId: new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID),
        })

        transaction.add(instruction)

        try {
            let txid = await sendTransaction(transaction, connection)
            alert(
                `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=custom`
            )
            console.log(
                `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=custom`
            )
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={"lg"}
                isCentered
            >
                <ModalOverlay
                    bgColor={"blackAlpha.600"}
                />
                <ModalContent
                    bg={"whitesmoke"}
                >
                    <ModalHeader
                        textTransform={"uppercase"}
                        pb={0}
                    >
                        {"I'm " + intro.name}
                    </ModalHeader>

                    <ModalCloseButton
                        color={"red"}
                        size={"md"}
                        mt={1}
                    />

                    <ModalBody pt={0}>
                        <Stack>
                            <Text size={"sm"} >{intro.message}</Text>
                            <form onSubmit={handleSubmit}>
                                <FormControl isRequired mt={5}>
                                    <Input
                                        width={"sm"}
                                        id="title"
                                        color={"black"}
                                        onChange={(event) => setComment(event.currentTarget.value)}
                                        placeholder="Enter your comment"
                                    />
                                </FormControl>

                                <Button type="submit" mt={3} colorScheme={"purple"}>
                                    Add comment
                                </Button>
                            </form>
                            <CommentList intro={intro} />
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div >
    )
}