import { Box, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { StudentIntro } from '../models/StudentIntro';

export interface CardProps {
    intro: StudentIntro;
}

export const Card: FC<CardProps> = (props) => {
    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            borderWidth={3}
            marginBottom={6}
        >
            <Stack
                w='full'
                align={{ base: "center", md: "stretch" }}
                textAlign={{ base: "center", md: "left" }}
                mt={{ base: 4, md: 0 }}
                ml={{ md: 4 }}
                mr={{ md: 4 }}
            >
                <Text
                    fontWeight="bold"
                    textTransform="uppercase"
                    fontSize={{ base: "lg", md: "xl" }}
                    letterSpacing="wide"
                    color="gray.200"
                >
                    {props.intro.name}
                </Text>

                <Text color="gray.400">
                    {props.intro.message}
                </Text>
            </Stack>
        </Box>
    )
}
