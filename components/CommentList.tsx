import { StudentIntro } from "../models/StudentIntro";
import { FC, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Comment } from "../models/comment";
import { Box, Button, Center, Heading, HStack, Spacer, Stack } from "@chakra-ui/react";
import { CommentCoordinator } from "../coordinators/CommentCoordinator";

interface CommentListProps {
    intro: StudentIntro
}

export const CommentList: FC<CommentListProps> = ({
    intro,
}: CommentListProps) => {
    const { connection } = useConnection();
    const [comments, setComments] = useState<Comment[]>([])
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetch = async () => {
            intro.publicKey().then(async (review) => {
                const comments = await CommentCoordinator.fetchPage(
                    connection,
                    review,
                    page,
                    3
                )

                setComments(comments)
            })
        }

        fetch();
    }, [page])

    return (
        <div>
            <Heading as="h1" size="l">
                Existing Comments
            </Heading>

            {
                comments.map((comment, i) => (
                    <Box>
                        <div key={i}>{comment.comment}</div>
                    </Box>
                ))
            }

            <Stack>
                <Center>
                    <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
                        {page > 1 && (
                            <Button onClick={() => setPage(page - 1)}>
                                Previous
                            </Button>
                        )}
                        <Spacer />
                        {CommentCoordinator.commentCount > page * 3 && (
                            <Button onClick={() => setPage(page + 1)}>
                                Next
                            </Button>
                        )}
                    </HStack>
                </Center>
            </Stack>
        </div>
    )
}