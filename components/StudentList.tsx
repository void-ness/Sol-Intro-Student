import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { StudentIntro } from '../models/StudentIntro'
import { StudCoordinator } from '../coordinators/StudentCoordinator';
import * as web3 from '@solana/web3.js';
import { Button, Center, HStack, Input, Spacer } from '@chakra-ui/react';
import { useConnection } from '@solana/wallet-adapter-react';

export const StudentList: FC = () => {
    const [studIntros, setStudIntros] = useState<StudentIntro[]>([])
    const { connection } = useConnection();
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [reload, setReload] = useState(false)

    useEffect(() => {
        StudCoordinator.fetchAccounts(
            connection,
            page,
            10,
            search,
            search !== ""
        ).then(setStudIntros)
    }, [page, search, reload, connection])

    const onRefresh = () => {
        StudCoordinator.fetchAccounts(
            connection,
            page,
            10,
            search,
            true
        ).then(setStudIntros)
    }

    return (
        <div>
            {/* <Center> */}
            <HStack>
                <Input
                    width={{ base: '100%', md: '50%' }}
                    color={'gray.400'}
                    onChange={event => setSearch(event.currentTarget.value.toLowerCase())}
                    placeholder={'search'}
                    mb={5}
                    mt={4}
                    mr={4}
                />

                <Button onClick={() => onRefresh()} size="sm" borderRadius="3xl" color="gray.700" background={"whiteAlpha.800"}>Refresh</Button>
            </HStack>
            {/* </Center> */}

            {
                studIntros.map((studIntro, i) => {
                    return (
                        <Card key={i} intro={studIntro} />
                    )
                })
            }

            <Center>
                <HStack w='full' my={2} mx={0}>
                    {
                        1 < page && <Button onClick={() => setPage(page - 1)}>Previous</Button>
                    }

                    <Spacer />

                    {
                        StudCoordinator.accounts.length > page * 10 && <Button onClick={() => setPage(page + 1)}>Next</Button>
                    }
                </HStack>
            </Center>
        </div>
    )
}