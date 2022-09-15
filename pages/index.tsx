import { Center, Box, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { AppBar } from '../components/AppBar'
import { StudentList } from '../components/StudentList'
import { Form } from '../components/Form'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Movie Reviews</title>
      </Head>
      <AppBar />
      <Center>
        <Box>
          <Heading as="h1" size="lg" color="white" ml={4} mt={8} mb={4}>
            Add your introduction
          </Heading>
          <Form />
          <Heading as="h1" size="lg" color="white" ml={4} mt={8} mb={4}>
            Meet other students
          </Heading>
          <StudentList />
        </Box>
      </Center>
    </div>
  )
}

export default Home