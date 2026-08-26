import { useEffect, useRef, useState } from 'react';
import './streaming-text.css';

function StreamingText({ textBlock }: { textBlock: string }) {
    const [streamedText, setStreamedText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    function onStartStream() {
        if (isStreaming) {
            return;
        }

        setIsStreaming(true);

        intervalRef.current = setInterval(() => {
            setStreamedText(prevText => {
                if (prevText.length >= textBlock.length) {
                    console.log("Stream complete.");
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    setIsStreaming(false);
                    return prevText;
                }
                return prevText + textBlock[prevText.length];
            });
        }, 100);
    }

    return (
        <section>
            <button onClick={onStartStream} disabled={isStreaming}>
                Start Stream
            </button>

            <div>
                <p>Streaming text:</p>
                {streamedText && (
                    <p>
                        { streamedText }
                        { isStreaming && <span className="cursor" /> }
                    </p>
                )}
            </div>
        </section>
    )
}

export default StreamingText;