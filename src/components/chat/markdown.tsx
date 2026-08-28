import { cn } from "@/lib/cn";

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    const token = m[0];
    if (token.startsWith("`")) {
      parts.push(
        <code
          key={`${keyBase}-c-${i}`}
          className="rounded-sm bg-raised px-1 py-0.5 font-mono text-[0.85em] text-fg"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      parts.push(
        <strong key={`${keyBase}-b-${i}`} className="font-medium text-fg">
          {token.slice(2, -2)}
        </strong>,
      );
    }
    last = m.index + token.length;
    i += 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/```/);
  const nodes: React.ReactNode[] = [];
  blocks.forEach((block, i) => {
    if (i % 2 === 1) {
      const nl = block.indexOf("\n");
      const code = nl === -1 ? block : block.slice(nl + 1);
      nodes.push(
        <pre
          key={`code-${i}`}
          className="my-2 overflow-x-auto rounded-md bg-inset p-3 font-mono text-xs leading-relaxed text-fg shadow-[var(--shadow-border)]"
        >
          <code>{code.replace(/\n$/, "")}</code>
        </pre>,
      );
      return;
    }
    const lines = block.split("\n");
    let para: string[] = [];
    const flush = (k: string) => {
      if (!para.length) return;
      const joined = para.join(" ");
      nodes.push(
        <p key={k} className="my-1.5 leading-relaxed text-fg/90">
          {renderInline(joined, k)}
        </p>,
      );
      para = [];
    };
    lines.forEach((line, li) => {
      const t = line.trim();
      if (!t) {
        flush(`p-${i}-${li}`);
        return;
      }
      if (t.startsWith("- ") || t.startsWith("* ")) {
        flush(`p-${i}-${li}`);
        nodes.push(
          <div key={`li-${i}-${li}`} className="flex gap-2 pl-1 text-fg/90">
            <span className="text-muted">–</span>
            <span>{renderInline(t.slice(2), `li-${i}-${li}`)}</span>
          </div>,
        );
        return;
      }
      para.push(t);
    });
    flush(`p-${i}-end`);
  });
  return <div className={cn("text-sm", className)}>{nodes}</div>;
}
