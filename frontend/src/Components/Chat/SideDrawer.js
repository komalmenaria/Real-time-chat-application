import React, { useState } from 'react'
import {
    useDisclosure, Tooltip, Button, Text, Menu, Box, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input, useToast,Spinner
} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from "./ProfileModal"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';



const SideDrawer = () => {
    const Navigate = useNavigate()

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user , setSelectedChat,chats , setChats , notification, setNotification} = ChatState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
 

    


    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        Navigate('/')
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter Something in the Search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
            return;
        }

        try {
      
            setLoading(true)
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.get(`http://localhost:5000/api/user/allUsers?search=${search}`, config);
            setLoading(false)
            setSearchResult(data);
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

    const accessChat = async (userId)=>{
        try {
            setLoadingChat(true);
            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.post(`http://localhost:5000/api/chat/accessOrCreateChat`,{userId},config);
            if(!chats.find((c)=>c._id === data._id))setChats([data,...chats])
            setSelectedChat(data);
            setLoadingChat(false);
            onClose()
        } catch (error) {
            toast({
                title: 'Error while fetching the chat',
                description:error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    return (
        <>
            <Box display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px">
                <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px="4"> Search User</Text>
                    </Button>
                </Tooltip >
                <Text fontSize="2xl" fontFamily="Work sans"> Lets Have Chat</Text>
                <div >
                    <Menu>
                        <MenuButton p={1}>
                        <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
                            <BellIcon fontSize="2xl" m={1} />
                                                    </MenuButton>
                        <MenuList pl={3}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notifi)=>(
                                 <MenuItem key={notifi._id} onClick={()=>{setSelectedChat(notifi.chat)
                                 setNotification(notification.filter((n)=> n !== notifi))
                                 }}>
                                 {notifi.chat.isGroupChat ? `New Message in ${notifi.chat.chatName}` : `New Message from ${getSender(user,notifi.chat.users)}`}
                                 </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem > My Profile</MenuItem>
                            </ProfileModal>
                            < MenuDivider />
                            <MenuItem onClick={logoutHandler}> Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen} size="sm">
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button color='white' bg="#2d725f" _hover={{
   color:'white' , bg:"#539481"
}}
                                onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map(user=>(
                                <UserListItem key={user.id}
                                user={user}
                                handleFunction={()=>accessChat(user._id)} />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex"/>}
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer