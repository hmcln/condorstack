"use client";

import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { Sun } from "lucide-react";

import {
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useTheme } from "next-themes";

import { useToggleTheme } from "@/hooks/use-toggle-theme";

export function NavUser({ showName }: { showName: boolean }) {
    const toggleTheme = useToggleTheme();
    const { resolvedTheme } = useTheme()
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="w-full flex justify-center pt-2 lg">
                    <UserButton showName={showName} appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }}>
                        <UserButton.MenuItems>
                            <UserButton.Action label="Toggle Theme" labelIcon={<Sun size={16} />} onClick={() => { toggleTheme() }} />
                        </UserButton.MenuItems>
                    </UserButton>
                </div>
            </SidebarMenuItem>
        </SidebarMenu >
    );
}
