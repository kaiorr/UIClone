import { IconButton, Text, VStack } from '@chakra-ui/core'
import React, { useState, useEffect } from 'react'
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'
import db from '../database/firebase'

const VoteButtons = ({ post }) => {
  const [isVoting, setVoting] = useState(false);
  const [votedPosts, setVotedPosts] = useState([]);

  useEffect(() => {
    const votesFromLocalStorage = localStorage.getItem('votes') || []
    let previousVotes = []

    try {
      previousVotes = JSON.parse(votesFromLocalStorage)
    } catch (error) {
      console.log(error)
    }

    setVotedPosts(previousVotes)

  }, [])

  const handleDisablingOfVoting = (postId) => {
    const previousVotes = votedPosts
    previousVotes.push(postId)

    setVotedPosts(previousVotes)

    localStorage.setItem('votes', JSON.stringify(votedPosts))
  }

  const handleClick = async (type) => {
    setVoting(true)

    let upVotesCount = post.upVotesCount;
    let downVotesCount = post.downVotesCount;

    const date = new Date();

    if (type === "upvote") {
      upVotesCount = upVotesCount + 1;
    } else {
      downVotesCount = downVotesCount + 1;
    }

    await db.collection("posts").doc(post.id).set({
      title: post.title,
      upVotesCount,
      downVotesCount,
      createdAt: post.createdAt,
      updatedAt: date.toUTCString(),
    });

    handleDisablingOfVoting(post.id)

    setVoting(false)
  };

  const checkIfPostIsAlreadyVoted = () => {
    if (votedPosts.indexOf(post.id) > -1) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <VStack>
        <IconButton
          size="lg"
          colorScheme="purple"
          aria-label="Upvote"
          icon={<FiArrowUp />}
          onClick={() => handleClick("upvote")}
          isLoading={isVoting}
          isDisabled={checkIfPostIsAlreadyVoted()}
        />
        <Text bg="gray.100" rounded="md" w="100%" p={1}>
          {post.upVotesCount}
        </Text>
      </VStack>
      <VStack>
        <IconButton
          size="lg"
          colorScheme="yellow"
          aria-label="Downvote"
          icon={<FiArrowDown />}
          onClick={() => handleClick("downvote")}
          isLoading={isVoting}
          isDisabled={checkIfPostIsAlreadyVoted}
        />
        <Text bg="gray.100" rounded="md" w="100%" p={1}>
          {post.downVotesCount}
        </Text>
      </VStack>
    </>
  );
};

export default VoteButtons;
