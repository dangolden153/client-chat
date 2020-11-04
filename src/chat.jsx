import React, { useState } from 'react'
import {Container, FormInput, Button } from 'shards-react'
import { WebSocketLink } from '@apollo/client/link/ws';
import {
     ApolloClient,
      InMemoryCache,
      ApolloProvider,
      useMutation,
      useSubscription,
       gql  } 
       from '@apollo/client';


       const link = new WebSocketLink({
        uri: `ws://dan-chatapp.herokuapp.com/`,
        options: {
          reconnect: true
        }
      });


const client = new ApolloClient({
    link,
  uri: 'https://dan-chatapp.herokuapp.com/',
  cache: new InMemoryCache()
});




const POST_MESSAGE = gql `
mutation  ($user: String!, $content: String! ){
    postMessage(user:$user, content:$content)
  }
`


const GET_MESSAGES = gql`
subscription { 
    messages {
      id
      user
      content
    }
  }
`

const Messages = ({user})=>{
    const {data} = useSubscription(GET_MESSAGES)
    if (!data){
        return null
    }

    return (
        <>
        {data.messages.map(({id, user:messageUser , content})=>(
            <div style={{
                display: "flex",
                justifyContent: user === messageUser ?  "flex-end" : "flex-start",
                paddingBottom: "1em"
            }}>
                {user !== messageUser && (
                    <div 
                    style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        border: "2px solid #a5a6ae",
                        marginRight: "0.5em",
                        textAlign: 'center',
                        fontSize: '18pt',
                        paddingTop: 5
                    }}>
                       { messageUser.slice(0,2).toUpperCase() }
                    </div>
                )}
                <div style={{
                     background: user === messageUser ?  "#58bf56" : "#e5e6ea",
                    color : user === messageUser ? "white" : "black",
                    padding: '1em',
                    borderRadius: "1em",
                    maxWidth: "60%"
                }}>
                    {content}
                </div>
            </div>
        ))}
        </>
    )
};



const Chat =()=>{
   
        const [state, setState] = useState({
            user:'dan',
            content: ''
        }) ;
        
        const [postMessage] = useMutation(POST_MESSAGE);
        
        const handleSubmit = (event)=>{
            event.preventDefault();
            if (state.content.length > 0){
                postMessage({
                    variables: state
                })
            }
            setState({...state,
                content:""})
        }
        
        
            return(
                    <Container>
                    <Messages user={state} />
        
                    <FormInput
                     label="user"
                     value ={state.user}
                     onChange={event => setState({
                        ...state,
                        user:event.target.value
                     })}/>
                       
                       <FormInput
                     label="content"
                     value ={state.content}
                     onChange={event => setState({
                         ...state,
                         content:event.target.value
                     })}
                     onKeyPress={event => event.key === 'Enter' ? handleSubmit(event) : null }
        
                     />
        
                     <Button onClick={(event)=>handleSubmit(event)}  >Send</Button>
                    </Container>
            )

                    }

export default ()=>(
    <ApolloProvider  client={client}>
        <Chat/>
    </ApolloProvider >
)