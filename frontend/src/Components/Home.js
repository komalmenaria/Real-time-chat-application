import React,{useState , useEffect} from 'react';
import { Container, Box, Text ,  Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [user, setUser] = useState();
  const Navigate = useNavigate()

  useEffect(() => {
   const userInfo = JSON.parse(localStorage.getItem('userInfo'));
   setUser(userInfo)
   if(userInfo){
      Navigate("/chat")
   }
  }, [Navigate])
    return (
        <Container maxW='xl' centerContent>
            <Box
                d='flex'
                justifyContent='center'
                p={3}
                bg={'white'}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                textAlign="center" >
                <Text fontSize='4xl' fontFamily='Work sans' color='black' >
                    Lets Have Chat
                </Text>
            </Box>
            <Box bg="white" p={4} w="100%" borderRadius="lg" borderWidth="1px" >
<Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>
            </Box>
        </Container>
    )
}

export default Home