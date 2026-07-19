"use client";

interface HighlightedTextProps {
  text: string;
  search: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, search }) => {
  if (!search.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-accent text-primary font-semibold">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
};

export default HighlightedText;
