"use client";

import type { LucideIcon } from "lucide-react";
import { ListTodo, PlusIcon, Printer, QrCode } from "lucide-react";

import { SectionHeader } from "@/components/ui/text";

import QuickAction from "./quick-action";

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
      title: "Checklist",
      linkTo: "/checklist",
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
