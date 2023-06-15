import React, { useState } from 'react'
import { VStack } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const Navigate = useNavigate()
  const toast = useToast()
  const [show, setShow] = useState(false)
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [pic, setPic] = useState()
  const [loading, setLoading] = useState(false)


  const handleClick = () => {
    setShow(!show)
  }
  const postDetails = (pics) => {
    setLoading(true)
    if (pics === undefined) {
      toast({
        title: 'Please select a picture',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
      return;
    }
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics)
      data.append('upload_preset', "chat-app")
      data.append('cloud_name', "komal9qf0")
      fetch("https://api.cloudinary.com/v1_1/komal9qf0/image/upload", {
        method: 'POST',
        body: data
      }).then(res => res.json()).then(data => {
        setPic(data.url.toString());
        setLoading(false)
      })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        });
    }
    else {
      toast({
        title: 'Please select a picture',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
    }
  }


  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: 'Password Doesnt Match!',
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
        "name":name,
        "email":email,
        "password":password,
        "pic":pic

      }
      const { data } = await axios.post('http://localhost:5000/api/user/register',userData,
        config
      );
      console.log(data);
      toast({
        title: 'Registration Success ',
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
    <VStack spacing="3px"  >
      <FormControl isRequired id="first-name">
        <FormLabel > Name </FormLabel>
        <Input placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl isRequired id="email">
        <FormLabel > Email </FormLabel>
        <Input placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl isRequired id="password">
        <FormLabel > Password </FormLabel>
        <InputGroup>
          <Input placeholder="Enter Your Password" type={show ? "text" : 'password'} onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>


      <FormControl isRequired id="confirm-password">
        <FormLabel > Confirm Password </FormLabel>
        <InputGroup>
          <Input placeholder=" Confirm Password" type={show ? "text" : 'password'} onChange={(e) => setConfirmPassword(e.target.value)} />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>






      <FormControl isRequired id="pic">
        <FormLabel > Upload Profile Picture </FormLabel>
        <Input type='file' p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])} />
      </FormControl>

      <Button  color='white' bg="#2d725f" _hover={{
   color:'white' , bg:"#539481"
}}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}>
        Sign Up
      </Button>


    </VStack>


  )
}

export default Signup