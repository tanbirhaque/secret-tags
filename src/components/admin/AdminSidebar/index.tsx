"use client";

import { Package, ShoppingCart, Users, BarChart3, Settings } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const items = [
    { title: "Products", url: "/admin/products", icon: Package },
    { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
    { title: "Customers", url: "/admin/customers", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <Sidebar collapsible="icon" className={collapsed ? "w-14" : "w-60"}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                        <Link href={item.url} passHref>
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {!collapsed && <span>{item.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}