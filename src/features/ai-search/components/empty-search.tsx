import { LayoutDashboard, ListSortDescending, Sparkles, SpellCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import { Separator } from "@/components/ui/separator";
import { SectionSubheader } from "@/components/ui/text";

type DescriptionPart = {
  text: string;
  highlight?: boolean;
};

const searchTips: {
  icon: typeof SpellCheck;
  title: string;
  description: DescriptionPart[];
}[] = [
  {
    icon: SpellCheck,
    title: "By what it is",
    description: [
      { text: "Name the item directly, like " },
      { text: "'coffee machine'", highlight: true },
      { text: " or " },
      { text: "'winter coats'", highlight: true },
      { text: "." },
    ],
  },
  {
    icon: ListSortDescending,
    title: "By how it looks",
    description: [
      { text: "Describe it even if you forgot the name - " },
      { text: "'black charging cable'", highlight: true },
      { text: " or " },
      { text: "'round glass vase'", highlight: true },
      { text: "." },
    ],
  },
  {
    icon: LayoutDashboard,
    title: "By where it might be",
    description: [
      { text: "Ask loosely and let AI find it - " },
      { text: "'stuff from the bathroom'", highlight: true },
      { text: " or " },
      { text: "'kids' toys'", highlight: true },
      { text: "." },
    ],
  },
];

interface EmptySearchProps {}

const EmptySearch: React.FC<EmptySearchProps> = ({}) => {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <SectionSubheader>What you can search</SectionSubheader>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-2.5 p-0">
          {searchTips.map((tip, index) => (
            <div key={tip.title} className="flex flex-col gap-2 py-1">
              <div className="flex items-start gap-3 px-4">
                <IconTile icon={tip.icon} size="sm" />
                <div className="flex flex-col gap-1">
                  <span className="text-foreground font-medium">{tip.title}</span>
                  <span className="text-muted-foreground text-sm font-light">
                    {tip.description.map((part) =>
                      part.highlight ? (
                        <span key={part.text} className="text-primary font-medium">
                          {part.text}
                        </span>
                      ) : (
                        <span key={part.text}>{part.text}</span>
                      ),
                    )}
                  </span>
                </div>
              </div>
              {index !== searchTips.length - 1 && <Separator className="bg-border-light" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card variant="tip">
        <CardContent className="flex items-start gap-2 px-3">
          <Sparkles className="text-primary size-12 pb-6" />
          <span className="text-sm font-light">
            You don&apos;t need exact words. Even if an item was never labeled, AI reads your box
            contents and photos to surface likely matches — ranked by how confident it is.
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptySearch;
