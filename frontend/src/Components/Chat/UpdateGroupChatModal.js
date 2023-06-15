import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button, useToast, Box, FormControl, Input ,Spinner
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from "../UserAvatar/UserListItem";
import axios from 'axios';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages }) => {


    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false)


    const { user, selectedChat, setSelectedChat } = ChatState();

const handleAddUser = async(user1) => { 
if(selectedChat.users.find((user) => user._id === user1._id)){
    toast({
        title: 'User Already in group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
    });
    return;
}
if(selectedChat.groupAdmin._id !== user._id ){
    toast({
        title: 'Only admin can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
    });
    return;
}
try {
    setLoading(true);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    };
    const { data } = await axios.put(`http://localhost:5000/api/chat/addToGroup`,{
        chatId:selectedChat._id,
        userId:user1._id,
    }, config);
    // console.log(data)
    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);

}
catch(error){
    toast({
        title: 'Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
    })
    setLoading(false);

}


}



    const handleRemove = async  (user1) => {

        if(selectedChat.groupAdmin._id !== user._id  && user1._id !== user._id){
            toast({
                title: 'Only admin can remove someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            return;
        }
        
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.put(`http://localhost:5000/api/chat/removeFromGroup`,{
                chatId:selectedChat._id,
                userId:user1._id,
            }, config);
            // console.log(data)
            user1._id === user._id ? setSelectedChat() :  setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        
        }
        catch(error){
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false);
        
        }
     }
    const handleRename = async() => {
        if(!groupChatName) return;
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const  {data} = await axios.put(`http://localhost:5000/api/chat/renameGroup`,{
                chatId:selectedChat._id,
                chatName:groupChatName,
            },config)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
            
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            }) 
            setRenameLoading(false)
                }
                setGroupChatName("");     
     }

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
            console.log(data)
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
    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    > {selectedChat.chatName} </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map(user => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input placeholder='Chat Name'
                            mb={3}
                            value={groupChatName}
                            onChange={(e)=>setGroupChatName(e.target.value)}
                            />
                            <Button variant="solid"
                            color='white' bg="#2d725f" _hover={{
                                color: 'white', bg: "#539481"
                            }}
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl >
                            <Input placeholder='Add User to group'
                            mb={1}
                            onChange={(e)=>handleSearch(e.target.value)}
                            />
                            </FormControl>

                            {loading? (
                                <Spinner size="lg" />
                            ): (
                                searchResult?.map((user)=>(
                                    <UserListItem 
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>handleAddUser(user)}
                                    />
                                ))
                            )

                            }
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={()=>handleRemove(user)} colorScheme='red'>
                            Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal