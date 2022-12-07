import { Box, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { StudentIntro } from '../models/StudentIntro';

export interface CardProps {
    intro: StudentIntro;
}

export const Card: FC<CardProps> = (props) => {
    return (
        <Box
            p={3}
            display={{ md: "flex" }}
            w={{ sm: 'full', md: '50%' }}
            maxWidth="32rem"
            borderWidth={3}
            marginBottom={6}
        >
            <Stack
                align={{ base: "center", md: "stretch" }}
                textAlign={{ base: "center", md: "left" }}
                mt={{ base: 0, md: 0 }}
                spacing={"0"}
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

                <Text
                    mt={2}
                    color="gray.400"
                >
                    {props.intro.message}
                </Text>
            </Stack>
        </Box >
    )
}
