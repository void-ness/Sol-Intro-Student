import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { StudentIntro } from '../models/StudentIntro'
import { StudCoordinator } from '../models/StudentCoordinator';
import * as web3 from '@solana/web3.js';
import { Button, Center, HStack, Input, Spacer } from '@chakra-ui/react';

export const StudentList: FC = () => {
    const [studIntros, setStudIntros] = useState<StudentIntro[]>([])
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")

    useEffect(() => {
        StudCoordinator.fetchAccounts(
            connection,
            page,
            10,
            search,
            search !== ''
        ).then(setStudIntros)
    }, [page, search])

    return (
        <div>
            {/* <Center> */}
            <Input
                width={'50%'}
                color={'gray.400'}
                onChange={event => setSearch(event.currentTarget.value)}
                placeholder={'search'}
                mb={5}
                mt={4}
            />
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