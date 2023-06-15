import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useDisclosure, Button, useToast, FormControl, Input, Spinner, Box
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from "../UserAvatar/UserListItem"
import UserBadgeItem from '../UserAvatar/UserBadgeItem';


function GroupChatModal({ children }) {


    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);


    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.get(`http://localhost:5000/api/user/allUsers?search=${search}`, config);
            // console.log(data)
            setLoading(false);
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: 'Failed to load the search results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.post(`http://localhost:5000/api/chat/createGroup`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=> u._id)),
            },config);
            setChats([data,...chats]);
            onClose();
            toast({
                title: 'New Group Chat Created!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        } catch (error) {
            toast({
                title: 'Failed to create the Chat',
                description:error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })  
        }
     }
    const handleDelete = (delUser) => { 
        setSelectedUsers(selectedUsers.filter((sel)=> sel._id !== delUser._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User Already exists',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            }) ;
            return ;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
     }
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center">Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users eg: Yogi, Vishal, Achal' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                       <Box w="100%" display="flex" flexWrap="wrap">
                       {selectedUsers.map(user =>(
                       <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)} />
                       ))}
                       </Box>

                        {loading ? < Spinner mt={2} /> : (

                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem  mt={2} key={user._id} user={user} handleFunction={()=>handleGroup(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button color='white' bg="#2d725f" _hover={{
   color:'white' , bg:"#539481"
}} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal