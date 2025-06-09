'use client'
import { useChat } from '@ai-sdk/react';

const Spinner = () => (
    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900'></div>
);

export function Chat() {
    const { messages, setMessages, input, setInput, append, handleInputChange, handleSubmit, status, error, reload, stop } = useChat({});
 
    const handleDelete = (id: string) =>{
        setMessages(messages.filter(message => message.id !== id))
        console.log("msg deleted")
    }
    return (
        <div className="flex flex-col w-full max-w-md mx-auto">
            <div className="flex-1 overflow-y-auto">

                {messages.map(m => (

                    <div key={m.id} className="mb-4">

                        <strong>{m.role}: </strong>
                        {m.content}
                        <button onClick={() => handleDelete(m.id)}>Delete</button>
                    </div>

                ))}

                {(status === 'submitted' || status === 'streaming') && (
                    <div>
                        {status === 'submitted' && <Spinner />}
                        <button type="button" onClick={() => stop()}>
                            Stop
                        </button>
                    </div>
                )
                }

                {(status === 'error') && (
                    <div>
                        An error occurred.
                        <button type='button' onClick={() => reload()}>Retry</button>
                    </div>

                )}

            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    name="prompt"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Say something..."
                    className="flex-1 p-2 border rounded"
                    disabled={status !== 'ready'}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}