import { Container, VStack } from '@chakra-ui/core'
import React, { useEffect, useState } from 'react'
import Post from './components/Posts'
import db from './database/firebase'

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {

    db.collection("posts")
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      });
  }, []);

  return (
    <>
      <Container maxW="md" centerContent p={8}>
        <VStack spacing={8} w="100%">
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </VStack>
      </Container>
    </>
  )
}

export default App;
