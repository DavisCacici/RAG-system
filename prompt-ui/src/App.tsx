import { useState } from 'react';

type PromptCard = {
  title: string;
  prompt: string;
  tone: string;
};


interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  isError?: boolean;
}

function MessageContent({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return <>{message.text}</>;
  }

  return <div dangerouslySetInnerHTML={{ __html: markdownToHtml(message.text) }} />;
}

function markdownToHtml(markdown: string) {
  const blocks = markdown.split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const trimmedBlock = block.trim();

      if (!trimmedBlock) {
        return '';
      }

      const lines = trimmedBlock.split('\n').map((line) => line.trim());
      const unorderedListItems = lines.filter((line) => /^[-*+]\s+/.test(line));
      const orderedListItems = lines.filter((line) => /^\d+\.\s+/.test(line));

      if (unorderedListItems.length === lines.length && lines.length > 0) {
        return `<ul class="mb-2 list-disc space-y-1 pl-5 last:mb-0">${unorderedListItems
          .map((item) => `<li>${formatInline(item.replace(/^[-*+]\s+/, ''))}</li>`)
          .join('')}</ul>`;
      }

      if (orderedListItems.length === lines.length && lines.length > 0) {
        return `<ol class="mb-2 list-decimal space-y-1 pl-5 last:mb-0">${orderedListItems
          .map((item) => `<li>${formatInline(item.replace(/^\d+\.\s+/, ''))}</li>`)
          .join('')}</ol>`;
      }

      const headingMatch = trimmedBlock.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        return `<h${level} class="mb-2 font-semibold">${formatInline(headingMatch[2])}</h${level}>`;
      }

      return `<p class="mb-2 whitespace-pre-wrap last:mb-0">${formatInline(trimmedBlock).replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('');
}

function formatInline(text: string) {
  const escaped = escapeHtml(text);

  return escaped
    .replace(/`([^`]+)`/g, '<code class="rounded bg-black/5 px-1 py-0.5 text-[0.95em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a class="underline decoration-moss/40 underline-offset-2" href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


export default function App() {
  const [promptValue, setPromptValue] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = uuidv4();
//   const url = 'http://localhost:5678/webhook-test/042a520f-3c86-4381-90f4-8a4dc0dff257';
  const url = 'http://davis.dnsitalia.org:24580/webhook/042a520f-3c86-4381-90f4-8a4dc0dff257';
  const handleSend = async () => {
    const trimmedPrompt = promptValue.trim();
    if (!trimmedPrompt || isLoading) return;

    setChat((prev: ChatMessage[]) => [...prev, { role: 'user', text: trimmedPrompt }]);
    setPromptValue('');
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP ${response.status}`);
      }

      const data = await response.json();
      const output = typeof data?.output === 'string' ? data.output : '';

      if (!output) {
        setChat((prev: ChatMessage[]) => [...prev, { role: 'assistant', text: 'Errore imprevisto', isError: true }]);
        return;
      }

      console.log('Response from n8n:', data);
      setChat((prev: ChatMessage[]) => [...prev, { role: 'assistant', text: output }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore imprevisto';
      setChat((prev: ChatMessage[]) => [
        ...prev,
        {
          role: 'assistant',
          text: `Si e verificato un errore: ${message}`,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-base text-ink font-body">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-[300px_1fr] lg:py-10">
        <aside className="rounded-3xl bg-paper p-5 shadow-card animate-rise">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-moss">Workspace</p>
          <h1 className="mt-3 font-display text-2xl leading-tight">Prompt Studio</h1>
        </aside>

        <main className="space-y-5">
          <section className="rounded-3xl bg-paper p-4 shadow-card md:p-6 animate-rise">
            <div className="space-y-4">
              {chat.map((message: ChatMessage, index: number) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-3xl rounded-2xl px-4 py-3 text-sm ${
                    message.role === 'user'
                      ? 'ml-auto bg-moss text-white'
                      : message.isError
                        ? 'mr-auto border border-red-300 bg-red-50 text-red-700'
                        : 'mr-auto border border-moss/15 text-black'
                  }`}
                >
                  <MessageContent message={message} />
                </div>
              ))}

              {isLoading && (
                <div className="mr-auto inline-flex items-center gap-2 rounded-2xl border border-moss/15 bg-white px-4 py-3 text-sm text-ink/70">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
                  <span>Attendo risposta...</span>
                </div>
              )}
            </div>

            <form className="mt-5 flex items-center gap-3 rounded-2xl border border-moss/20 bg-white p-2" onSubmit={(e) => {              e.preventDefault();
              handleSend();
            }}>
              <input
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="Scrivi il tuo prompt qui..."
              />
              <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}>
                {isLoading ? 'Invio...' : 'Invia'}
              </button>
            </form>
          </section>

       
        </main>
      </div>
    </div>
  );
}
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


