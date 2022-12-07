import { Center, Box, Heading, Text, Flex } from '@chakra-ui/react'
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
      <Flex
        direction={{ base: "column" }}
      >
        {/* <Center> */}
        <Box width={{ base: '80%', md: "40vw" }} mx={{ base: "auto", md: 10 }}>
          <Heading as="h1" size="lg" color="white" ml={0} mt={8} mb={0}>
            Introduce Yourself
          </Heading>
          <Text color="whiteAlpha.700" ml={0} fontStyle="italic">Let others know more about you</Text>
          <Form />
        </Box>
        <Box width={"70vw"}>
          <Heading as="h1" size="lg" color="white" ml={0} mt={8} mb={0}>
            Meet other students
          </Heading>
          <Text color="whiteAlpha.700" ml={0} fontStyle="italic">Get to know about your peers</Text>
          <StudentList />
        </Box>
        {/* </Center> */}
      </Flex>
    </div>
  )
}

export default Home