import { FC } from 'react'
import styles from '../styles/Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import { Text } from '@chakra-ui/react'

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" height={30} width={200} alt="logo" className={styles.AppLogo} />
            <Text
                bgGradient={'linear(to-tr,purple.400 20%, blue.400, green.300)'}
                bgClip='text'
                fontWeight={'bold'}
                fontSize={{ base: '2.7rem' }}
                mb={{ base: '4' }}
            >
                Soul-Connects
            </Text>
            <WalletMultiButton />
        </div>
    )
}