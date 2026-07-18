"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Loader, Upload, User } from "lucide-react";

interface UpdateSessionData {
  user: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
    id: string;
    provider?: string;
  };
  trigger?: "update";
}

export default function ProfileUpdate() {
  const { data: session, update } = useSession();
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const initialUsername = session?.user?.name;
  const initialImage = session?.user?.image;

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "");
      setImagePreview(session.user.image || null);
    }
  }, [session]);

  useEffect(() => {
    const hasChanges =
      username !== initialUsername || imagePreview !== initialImage;
    setHasUnsaved(initialImage !== session?.user.image ? false : hasChanges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, imagePreview, session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    if (image) formData.append("file", image);
    formData.append("username", username);

    try {
      const res = await axios.post("/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        await update({
          user: {
            ...session?.user,
            id: session?.user?.id ?? "",
            name: username,
            image: res.data.url || null,
          },
          trigger: "update",
        } as UpdateSessionData);
        setHasUnsaved(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setHasUnsaved(false);
    }
  };

  const handleDiscard = () => {
    setUsername(session?.user.name || "");
    setImagePreview(session?.user.image || null);
    setImage(null);
    setHasUnsaved(false);
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h2 className="font-display font-bold text-text text-xl sm:text-2xl">
          Settings
        </h2>
        <p className="mt-1 text-sm font-mono text-muted">
          Manage your profile details
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm p-4 sm:p-6 mb-3 transition-all duration-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20 border border-border rounded-xl">
              <AvatarImage src={imagePreview || undefined} alt={username} />
              <AvatarFallback className="bg-surface rounded-xl">
                <User className="h-8 w-8 text-muted" />
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-9 items-center justify-center gap-2 border border-border rounded-xl bg-black text-white px-4 font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" /> Upload new picture
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="font-display font-bold text-text block mb-1"
            >
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full h-11 px-3 text-sm font-mono text-text bg-white border border-border rounded-xl placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-highlight transition-colors truncate"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !hasUnsaved}
              className="w-full sm:w-auto sm:flex-1 inline-flex h-11 items-center justify-center gap-2 bg-text text-surface font-bold uppercase tracking-widest text-xs rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && <Loader className="h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            {hasUnsaved && (
              <button
                type="button"
                onClick={handleDiscard}
                className="w-full sm:w-auto sm:flex-1 inline-flex h-11 items-center justify-center gap-2 border border-border bg-surface font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-surface-2 transition-colors text-text"
              >
                Discard
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
