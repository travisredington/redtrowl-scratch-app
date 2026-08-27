import { useEffect, useRef, useState } from 'react';
import './streaming-text.css';

interface StreamingTextProps {
    textBlock: string;
}

function StreamingText({ textBlock }: StreamingTextProps) {
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

        setStreamedText('');
        setIsStreaming(true);

        intervalRef.current = setInterval(() => {
            setStreamedText(prevText => {
                if (prevText.length >= textBlock.length) {
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
                    <p aria-live="polite">
                        { streamedText }
                        { isStreaming && <span className="cursor" /> }
                    </p>
                )}
            </div>
        </section>
    )
}

export default StreamingText;