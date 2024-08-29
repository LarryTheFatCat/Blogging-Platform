import { useTheme } from 'next-themes';
import { Switch } from "@nextui-org/react";
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        setIsChecked(theme === 'dark');
    }, [theme]);

    const handleChange = (checked) => {
        setIsChecked(checked);
        setTheme(checked ? 'dark' : 'light');
    };

    return (
        <div>
            <h1 className="text-lg mt-5">Theme Switcher</h1>
            <p className="text-xs text-gray-500 mb-5">
                Switch between dark mode and light mode
            </p>
            <div className="flex items-center">
                <Switch
                    checked={isChecked}
                    onChange={(e) => handleChange(e.target.checked)}
                    size="lg"
                    color="secondary"
                    startContent={<SunIcon className="h-6 w-6" />}
                    endContent={<MoonIcon className="h-6 w-6" />}
                />
                <span className="ml-3">
                    {isChecked ? 'Dark Mode' : 'Light Mode'}
                </span>
            </div>
        </div>
    );
}