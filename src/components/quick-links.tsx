import { Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

// Define types for our shortcuts
interface Shortcut {
  id: string;
  name: string;
  url: string;
  iconUrl: string;
}

const defaultShortcuts: Shortcut[] = [
  {
    id: "1",
    name: "YouTube",
    url: "https://youtube.com",
    iconUrl: "https://www.youtube.com/favicon.ico",
  },
];

const QuickLinks: React.FC = () => {
  // State for shortcuts, form visibility, and form inputs
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState<{
    name: string;
    url: string;
    iconUrl: string;
  }>({
    name: "",
    url: "",
    iconUrl: "",
  });

  // Extract domain for favicon service
  const getDomainFromUrl = (url: string): string => {
    try {
      // Add protocol if missing
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }

      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      // If URL parsing fails, return the original URL
      return url.replace(/^https?:\/\//i, "").split("/")[0];
    }
  };

  // Get favicon URL using Google's favicon service
  const getFaviconUrl = (url: string): string => {
    const domain = getDomainFromUrl(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  // Load shortcuts from localStorage on component mount
  useEffect(() => {
    const savedShortcuts = localStorage.getItem("quickLinks");
    if (savedShortcuts) {
      setShortcuts(JSON.parse(savedShortcuts));
    } else {
      setShortcuts(defaultShortcuts);
    }
  }, []);

  // Save shortcuts to localStorage whenever they change
  useEffect(() => {
    if (shortcuts.length > 0) {
      localStorage.setItem("quickLinks", JSON.stringify(shortcuts));
    }
  }, [shortcuts]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewShortcut({ ...newShortcut, [name]: value });
  };

  // Add new shortcut
  const handleAddShortcut = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL format
    let url = newShortcut.url;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    // Create new shortcut with automatically generated favicon if none provided
    const shortcut: Shortcut = {
      id: Date.now().toString(),
      name: newShortcut.name,
      url: url,
      iconUrl: newShortcut.iconUrl || getFaviconUrl(url),
    };

    // Add to shortcuts array
    setShortcuts([...shortcuts, shortcut]);

    // Reset form
    setNewShortcut({ name: "", url: "", iconUrl: "" });

    // Close the dialog
    setDialogOpen(false);
  };

  const handleRemoveShortcut = (id: string) => {
    setShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id));
  };

  return (
    <div className="quick-links">
      <div className="quick-links-header">
        <h3>Quick Links</h3>
      </div>

      <div className="links-grid">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.id} className="quick-link-container relative">
            <a
              href={shortcut.url}
              className="quick-link"
              title={`Go to ${shortcut.name}`}
            >
              <img
                src={shortcut.iconUrl}
                alt={shortcut.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFaviconUrl(
                    shortcut.url
                  );
                }}
              />
              <span className="link-tooltip">{shortcut.name}</span>
            </a>

            <button
              className="absolute top-0 right-0 bg-red-500/50 p-0.5 rounded-full"
              onClick={() => handleRemoveShortcut(shortcut.id)}
              title="Remove shortcut"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {shortcuts.length < 8 ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="quick-link">
                <Plus />
              </button>
            </DialogTrigger>

            <DialogContent>
              <form className="space-y-4" onSubmit={handleAddShortcut}>
                <DialogHeader>
                  <DialogTitle>Add shortcut</DialogTitle>
                </DialogHeader>
                <div className="grid gap-y-2">
                  <label htmlFor="name" className="text-sm text-white/70">
                    Title
                  </label>
                  <input
                    className="border border-gray-700 px-2 py-2 rounded-lg  focus:outline-none"
                    type="text"
                    id="name"
                    name="name"
                    value={newShortcut.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="grid gap-y-2">
                  <label htmlFor="url" className="text-sm text-white/70">
                    URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    value={newShortcut.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    required
                    className="border border-gray-700 px-2 py-2 rounded-lg  focus:outline-none"
                  />
                </div>

                <DialogFooter>
                  <Button className="bg-white text-black" type="submit">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default QuickLinks;
