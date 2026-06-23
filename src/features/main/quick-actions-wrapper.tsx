"use client";

import { ListTodo, LucideIcon, PlusIcon, Printer, QrCode } from "lucide-react";
import QuickAction from "./quick-action";
import { SectionHeader } from "@/components/ui/text";

type QuickAction = {
  id: number;
  icon: LucideIcon;
  title: string;
  linkTo: string;
  comingSoon?: boolean;
};

interface QuickActionsWrapperProps {}

const QuickActionsWrapper: React.FC<QuickActionsWrapperProps> = ({}) => {
  const quickActions: QuickAction[] = [
    {
      id: 1,
      icon: PlusIcon,
      title: "Add box",
      linkTo: "/boxes/add",
    },
    {
      id: 2,
      icon: ListTodo,
      title: "Todo list",
      linkTo: "/boxes/add",
      comingSoon: true,
    },
    {
      id: 3,
      icon: Printer,
      title: "Print",
      linkTo: "/boxes/add",
      comingSoon: true,
    },
    {
      id: 4,
      icon: QrCode,
      title: "Scan QR",
      linkTo: "/boxes/add",
      comingSoon: true,
    },
  ];

  return (
    <>
      <SectionHeader>Quick actions</SectionHeader>

      <div className="grid grid-cols-4 gap-2.5">
        {quickActions.map((action) => (
          <QuickAction
            key={action.id}
            icon={action.icon}
            title={action.title}
            linkTo={action.linkTo}
            comingSoon={action.comingSoon}
          />
        ))}
      </div>
    </>
  );
};

export default QuickActionsWrapper;
