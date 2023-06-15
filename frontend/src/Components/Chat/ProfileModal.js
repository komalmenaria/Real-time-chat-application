import React from 'react'
import { IconButton, useDisclosure ,Button ,Image , Text, Avatar} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {
                children ? <span onClick={onOpen}> {children}</span> : (
                    
                    <Avatar src={user.pic} onClick={onOpen} cursor="pointer" mr={2} />
                    
                )
            }

            <Modal size="lg" isOpen={isOpen} onClose={onClose}v>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader fontSize="40px" fontFamily="Work sans"
                    display="flex" justifyContent="center">{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
                      <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name} />
                      <Text fontSize={{base:"28px", md:"30px"}} fontFamily="Work sans">
Email:{user.email}
                      </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button color='white' bg="#2d725f" _hover={{
   color:'white' , bg:"#539481"
}} mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal