'use client';

import { useChat } from '@ai-sdk/react';
import { RotateCcw, Send, Square, Trash2 } from 'lucide-react';

export default function Chat() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        status,
        error,
        stop,
        reload,
        setMessages,
    } = useChat({
        api: '/api/chat',
        onError: (error) => {
            console.error('Chat error:', error);
        },
        onFinish: (message, { usage, finishReason }) => {
            console.log('Message finished:', { usage, finishReason });
        },
    });

    const handleDelete = (id: string) => {
        setMessages(messages.filter(message => message.id !== id));
    };

    const isLoading = status === 'submitted' || status === 'streaming';

    return (
        <div className="mx-auto flex h-[600px] max-w-4xl flex-col rounded-lg border bg-white shadow-lg">
            {/* Header */}
            <div className="border-b bg-gray-50 p-4">
                <h2 className="text-xl font-semibold text-gray-800">AI Chat Assistant</h2>
                <p className="text-sm text-gray-600">Powered by T3 Stack + Vercel AI SDK</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="mb-4 text-4xl">💬</div>
                            <p className="text-lg">Start a conversation!</p>
                            <p className="text-sm">Ask me anything and I'll help you out.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div
                                    className={`group relative max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">{message.content}</div>

                                    {/* Delete button - shows on hover */}
                                    <button
                                        onClick={() => handleDelete(message.id)}
                                        className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:block group-hover:opacity-100"
                                        title="Delete message"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.1s' }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-sm">AI is thinking...</span>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="border-t bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-red-700">
                            <p className="font-medium">Something went wrong</p>
                            <p className="text-sm">Please try again or reload the conversation.</p>
                        </div>
                        <button
                            onClick={() => reload()}
                            className="flex items-center space-x-2 rounded bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
                        >
                            <RotateCcw size={16} />
                            <span>Retry</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Input Form */}
            <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        name="prompt"
                        value={input}
                        onChange={handleInputChange}
                        disabled={isLoading || error != null}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                    />

                    {/* Control buttons */}
                    <div className="flex space-x-2">
                        {isLoading ? (
                            <button
                                type="button"
                                onClick={() => stop()}
                                className="flex items-center space-x-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                            >
                                <Square size={16} />
                                <span>Stop</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    type="submit"
                                    disabled={error != null || !input.trim()}
                                    className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                                >
                                    <Send size={16} />
                                    <span>Send</span>
                                </button>

                                {messages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => reload()}
                                        disabled={status !== 'ready' && status !== 'error'}
                                        className="flex items-center space-x-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
                                        title="Regenerate last response"
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </form>

                {/* Status indicator */}
                <div className="mt-2 text-xs text-gray-500">
                    Status: {status} {isLoading && '• Processing...'}
                </div>
            </div>
        </div>
    );
}