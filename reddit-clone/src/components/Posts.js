import { Box, HStack, Text } from '@chakra-ui/core'
import React from 'react'
import VoteButons from './vote-buttons'

const Post = ({ post }) => {
  return (
    <HStack key={post.id} w="100%" alignItems="flex-start">
       <VoteButons post={post} />
      <Box gb="gray.100" p={4} rounded="md" w="100%">
        <Text> {post.title} </Text>
      </Box>
    </HStack>
  )
}

export default Post
