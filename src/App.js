import { useState, useEffect } from "react";
import ScrollableFeed from 'react-scrollable-feed'

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null) // sets unique titles everytime we click "new title"
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      ); //we will pass some data, aka what we are writting in the input
      const data = await response.json();
      setMessage(data.choices[0].message); //get into the array, go to choices, get the first item and get the message. (check json) The message will be an object that has the content and the role
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(currentTitle, value, message);
    // if there is no current title, however we do have a value in our input and a message that has come back to us, then set the currentTitle to be whatever the value is
    //and we save it and add it to the history
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    if (currentTitle && value && message) {
      setPreviousChats(prevChats => ( //I will get whatever is in that array
          //open up the array, get the previous chats...
          [
            ...prevChats,
            //then add 2 objects...
            {
              title: currentTitle,
              role: "user",
              content: value, //save whatever we ask the AI
            },
            {
              //response from the AI
              title: currentTitle,
              role: message.role, //role from the object
              content: message.content, //content from the object
            },
          ]
      ));
    }
  }, [message, currentTitle]);

  console.log(previousChats);
  //look at each previous chat in my array, look at the title, and if it equals the current title we are currently on, we know we are on the currenChat.
  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  //get the previous chats and map, get the individual previous chat and get the title. Pass all of this in a new set. (get unique items from an object)
  const uniqueTitles =  Array.from(new Set(previousChats.map(previousChat => previousChat.title))) // so we can map them on into the history
  console.log(uniqueTitles)
   

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
         {uniqueTitles?.map((uniqueTitle, index)=> <li key={index} onClick={()=> handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Mich</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>MichGPT</h1>}
        <ScrollableFeed>
        <ul className="feed">
        {/* //Get current chat in the feed */}
        {/* checks if the current chat exists before mapping. Then maps into a list Item */}
         {currentChat?.map((chatMessage, index) => 
          <li key={index}>
          {/* //shows who sent the message */}
            <p className="role">{chatMessage.role}</p> 
            {/* //shows the content */}
            <p>{chatMessage.content}</p>
          </li>
          )}
        </ul>
          </ScrollableFeed>
        <div className="bottom-section">
          <div className="input-container">
            {/* //Displays the value. On change, pass through the event, I'm gonna set value to whatever e.target value is on that input */}
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">
            Free Research Preview. ChatGPT may produce inaccurate information
            about people, places, or facts. ChatGPT May 24 Version
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
