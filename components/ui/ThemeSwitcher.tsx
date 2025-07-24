"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop, Palette, Check } from "lucide-react"; // Added Palette and Check

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    // This is important to avoid hydration mismatches when the server rendered
    // theme is different from the client's preference or system theme.
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const themeOptions = [
        { name: "GL 1", value: "theme-gl-1", icon: <Palette className="mr-2 h-4 w-4" /> },
        { name: "GL 2", value: "theme-gl-2", icon: <Palette className="mr-2 h-4 w-4" /> },
        { name: "GL 3", value: "theme-gl-3", icon: <Palette className="mr-2 h-4 w-4" /> }, // Example
        { name: "GL 4", value: "theme-azul", icon: <Palette className="mr-2 h-4 w-4" /> }, // Example, can be more specific
        { name: "GL 5", value: "theme-naranja", icon: <Palette className="mr-2 h-4 w-4" /> }, // Example
        { name: "GL 6", value: "theme-bubblegum", icon: <Palette className="mr-2 h-4 w-4" /> }, // Example
    ];

    // Render a placeholder or null until mounted to avoid hydration issues
    // with theme-dependent icons in the trigger button.
    // Or, use a generic icon that doesn't depend on the theme initially.
    if (!mounted) {
        // Optionally, render a skeleton or a simple button
        return (
            <Button variant="outline" size="icon" disabled>
                <Palette className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        );
    }

    // Determine current trigger icon based on theme (optional, Palette is generic)
    // For simplicity, we'll use Palette icon for the trigger.
    // A more complex logic could show Sun for 'light', Moon for dark themes.
    // const TriggerIcon = () => {
    //   if (theme === 'light') return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    //   if (theme === 'theme-dark-knight' || theme === 'theme-navy-blue' || theme === 'theme-sunset') return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    //   if (theme === 'system') return <Laptop className="h-[1.2rem] w-[1.2rem]" />;
    //   return <Palette className="h-[1.2rem] w-[1.2rem]" />; // Default
    // };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Palette className="h-[1.2rem] w-[1.2rem]" />
                    {/* <TriggerIcon /> */}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themeOptions.map((opt) => (
                    <DropdownMenuItem key={opt.value} onClick={() => setTheme(opt.value)} className="cursor-pointer">
                        {opt.icon}
                        <span>{opt.name}</span>
                        {theme === opt.value && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
