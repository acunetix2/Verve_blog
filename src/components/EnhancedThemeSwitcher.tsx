import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Palette,
  Monitor,
  Check,
  Contrast,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

type Theme = "light" | "dark" | "system";
type Contrast = "normal" | "high";

interface ThemeSettings {
  theme: Theme;
  contrast: Contrast;
  fontSize: number;
  useSystemFont: boolean;
  animationReduces: boolean;
}

const EnhancedThemeSwitcher: React.FC = () => {
  const [settings, setSettings] = useState<ThemeSettings>({
    theme: "system",
    contrast: "normal",
    fontSize: 100,
    useSystemFont: false,
    animationReduces: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentSystemTheme, setCurrentSystemTheme] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    loadThemeSettings();
    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setCurrentSystemTheme(e.matches ? "dark" : "light");
      if (settings.theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    applyTheme();
    saveThemeSettings();
  }, [settings]);

  const loadThemeSettings = () => {
    const saved = localStorage.getItem("themeSettings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load theme settings:", error);
      }
    }
  };

  const saveThemeSettings = () => {
    localStorage.setItem("themeSettings", JSON.stringify(settings));
  };

  const applyTheme = () => {
    const root = document.documentElement;
    const effectiveTheme =
      settings.theme === "system" ? currentSystemTheme : settings.theme;

    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply contrast
    if (settings.contrast === "high") {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply font size
    root.style.fontSize = `${16 * (settings.fontSize / 100)}px`;

    // Apply font family
    if (settings.useSystemFont) {
      root.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    } else {
      root.style.fontFamily =
        '"Space Grotesk", "JetBrains Mono", system-ui, sans-serif';
    }

    // Reduce animations if needed
    if (settings.animationReduces) {
      document.documentElement.style.setProperty(
        "--transition-duration",
        "0ms"
      );
      root.classList.add("reduce-motion");
    } else {
      document.documentElement.style.setProperty(
        "--transition-duration",
        "200ms"
      );
      root.classList.remove("reduce-motion");
    }
  };

  const handleThemeChange = (theme: Theme) => {
    setSettings({ ...settings, theme });
    toast.success(`Theme changed to ${theme}`);
  };

  const handleContrastChange = (contrast: Contrast) => {
    setSettings({ ...settings, contrast });
    toast.success(`Contrast set to ${contrast}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Theme Selection */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Palette size={24} />
          Theme Settings
        </h2>

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Choose your theme
          </label>

          <div className="grid grid-cols-3 gap-4">
            {/* Light Theme */}
            <button
              onClick={() => handleThemeChange("light")}
              className={`relative p-6 rounded-lg border-2 transition-all ${
                settings.theme === "light"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Sun className="text-yellow-500" size={28} />
                <span className="text-sm font-medium">Light</span>
              </div>
              {settings.theme === "light" && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => handleThemeChange("dark")}
              className={`relative p-6 rounded-lg border-2 transition-all ${
                settings.theme === "dark"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Moon className="text-slate-600" size={28} />
                <span className="text-sm font-medium">Dark</span>
              </div>
              {settings.theme === "dark" && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </button>

            {/* System Theme */}
            <button
              onClick={() => handleThemeChange("system")}
              className={`relative p-6 rounded-lg border-2 transition-all ${
                settings.theme === "system"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Monitor className="text-gray-600" size={28} />
                <span className="text-sm font-medium">System</span>
              </div>
              {settings.theme === "system" && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </button>
          </div>

          {settings.theme === "system" && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-900 dark:text-blue-100">
              Current system theme: <strong>{currentSystemTheme}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Eye size={20} />
          Accessibility Options
        </h3>

        <div className="space-y-4">
          {/* Contrast */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Contrast Level
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => handleContrastChange("normal")}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                  settings.contrast === "normal"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => handleContrastChange("high")}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                  settings.contrast === "high"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                }`}
              >
                High Contrast
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Font Size: {settings.fontSize}%
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    fontSize: Math.max(80, prev.fontSize - 10),
                  }))
                }
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                A-
              </button>
              <input
                type="range"
                min="80"
                max="150"
                step="10"
                value={settings.fontSize}
                onChange={(e) =>
                  setSettings({ ...settings, fontSize: parseInt(e.target.value) })
                }
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    fontSize: Math.min(150, prev.fontSize + 10),
                  }))
                }
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                A+
              </button>
            </div>
          </div>

          {/* Advanced Options */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.useSystemFont}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      useSystemFont: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Use system font family (more accessible)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.animationReduces}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      animationReduces: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Reduce animations (prefers-reduced-motion)
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Preview
        </h3>
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Heading Sample
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              This is how your content will appear with the selected theme and settings.
            </p>
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Sample Button
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-green-900 dark:text-green-100">
          Your theme preferences are automatically saved and will be applied across all your visits.
        </p>
      </div>
    </div>
  );
};

export default EnhancedThemeSwitcher;
