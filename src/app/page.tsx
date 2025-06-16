import Chat from "~/components/Chat";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            T3 Stack + AI Chat
          </h1>
          <p className="text-lg text-gray-600">
            A modern chatbot built with Next.js, TypeScript, Tailwind CSS, and Vercel AI SDK
          </p>
        </div>

        <Chat />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Built with{" "}
            <a
              href="https://create.t3.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              T3 Stack
            </a>{" "}
            and{" "}
            <a
              href="https://ai-sdk.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Vercel AI SDK
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}