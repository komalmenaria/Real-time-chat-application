
import React, { useState } from 'react'
import { VStack } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"


const Login = () => {
  const Navigate = useNavigate()
  const toast = useToast()
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
  
  
    const handleClick = () => {
      setShow(!show)
    }
  
    const submitHandler = async () => {
      setLoading(true);
      if ( !email || !password ) {
        toast({
          title: 'Please Fill All The Required Fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right'
        })
        setLoading(false);
        return;
      }
     
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const userData = {
          "email":email,
          "password":password,
  
        }
        const { data } = await axios.post('http://localhost:5000/api/user/login',userData,
          config
        );
        toast({
          title: 'Login Successfully ',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right'
        });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        Navigate("/chat")
      } catch (error) {
        toast({
          title: 'Error occured ',
          description: error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right'
        });
        setLoading(false);
  
      }
  
    }
    return (
      <VStack spacing="5px"  >
        <FormControl isRequired id="email1">
          <FormLabel > Email </FormLabel>
          <Input placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} value={email}/>
        </FormControl>
        <FormControl isRequired id="password1">
          <FormLabel > Password </FormLabel>
          <InputGroup>
            <Input placeholder="Enter Your Password" type={show? "text" : 'password'} onChange={(e) => setPassword(e.target.value)}  value={password}/>
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
 
        <Button color='white' bg="#2d725f" _hover={{
   color:'white' , bg:"#539481"
}}
        width="100%"
        style={{marginTop:15}}
        onClick={submitHandler} isLoading={loading}>
          Login 
        </Button>
        <Button colorScheme='red'
      variant="solid"
      width="100%"
      style={{marginTop:15}}
      onClick={()=>{
        setEmail("guest@example.com");
        setPassword("123456");
      }}>
        Get Guest User Credentials
      </Button>
      </VStack>
  )
}

export default Login