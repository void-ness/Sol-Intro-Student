import { StudentIntro } from "../models/StudentIntro";
import { FC, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Comment } from "../models/comment";
import { Box, Button, Center, Heading, HStack, Spacer, Stack, Text } from "@chakra-ui/react";
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
        <div style={{ "marginBottom": "10px" }}>
            <Heading size="md" mt={4} mb={2}>
                Existing Comments
            </Heading>

            {
                comments.map((comment, i) => (
                    <Box
                        key={i}
                        bgColor={"purple.200"}
                        width={"fit-content"}
                        py={1}
                        px={4}
                        borderRadius={"md"}
                        borderTopLeftRadius={"0"}
                        mb={3}
                        fontSize={"md"}
                        fontWeight={"medium"}
                    >
                        <div>{comment.comment}</div>
                    </Box>
                ))
            }

            <Stack>
                <HStack w="full" mt={6}>
                    {page > 1 && (
                        <Button onClick={() => setPage(page - 1)} colorScheme={"purple"}>
                            Previous
                        </Button>
                    )}

                    <Spacer />

                    {CommentCoordinator.commentCount > page * 3 && (
                        <Button onClick={() => setPage(page + 1)} colorScheme={"purple"}>
                            Next
                        </Button>
                    )}
                </HStack>

                <Text align={"center"}>{page}</Text>
            </Stack>
        </div>
    )
}