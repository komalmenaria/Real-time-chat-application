import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogics'
import { ChatState } from '../../Context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'
import ScrollableFeed from 'react-scrollable-feed'

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState()
    return (
        <ScrollableFeed >
            {messages && messages.map((message, index) => (
                <div style={{ display: "flex" }} key={message._id}>
                    {
                        (isSameSender(messages, message, index, user._id)
                            || isLastMessage(messages, index, user._id)
                        ) && (
                            <Tooltip label={message.sender.name}
                                placement='bottom-start'
                                hasArrow
                            >
                                <Avatar mt="7px"  size="sm" cursor="pointer" name={message.sender.name} src={message.sender.pic} />
                            </Tooltip>
                        )
                    }
                    <span style={{backgroundColor: `${message.sender._id === user._id ? "#92D5C1" : "#fff"}`,
                    fontFamily:"Work sans",
                    fontWeight:"700",
                    borderRadius: `${message.sender._id === user._id ? "10px 0px 10px 10px" : "0px 10px 10px 10px"}` ,
                padding:"5px 15px",
                maxWidth:"75%" ,
                marginLeft:isSameSenderMargin(messages, message,index,user._id),
                marginTop:isSameUser(messages, message, index, user._id) ? 3 :10,   
                }}
                    >
{message.content}
                    </span>
                </div>
            ))}

        </ScrollableFeed>
    )
}

export default ScrollableChat