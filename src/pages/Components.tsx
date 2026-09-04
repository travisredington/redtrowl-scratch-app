import { useState } from 'react';
import StreamingText from "../components/streaming-text/streaming-text";
import MainContent from "../components/ui/main-content/main-content";

function ComponentsPage() {
    const [inputText, setInputText] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    return (
        <MainContent>
            <h2>Mock Implementation of a Streaming Component</h2>

            <p>This component takes a text prop and outputs the text in a streaming fashion.</p>

            <input type="text" value={inputText} onChange={handleInputChange} placeholder="Enter text to stream" />

            <StreamingText textBlock={inputText}/>

            <hr />
        </MainContent>
    )
}

export default ComponentsPage;