"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader, Upload } from "lucide-react";

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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

    if (initialImage !== session?.user.image) {
      setHasUnsavedChanges(false);
    } else {
      setHasUnsavedChanges(hasChanges);
    }
  }, [username, imagePreview, session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        const updateData: UpdateSessionData = {
          user: {
            ...session?.user,
            id: session?.user?.id ?? "",
            name: username,
            image: res.data.url || null,
          },
          trigger: "update",
        };
        await update(updateData);
        setHasUnsavedChanges(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description:
          "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setHasUnsavedChanges(false);
    }
  };

  const handleDiscardChanges = () => {
    setUsername(session?.user.name || "");
    setImagePreview(session?.user.image || null);
    setImage(null);
    setHasUnsavedChanges(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-slate-700/50 border-[0.5px] border-slate-600">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={imagePreview || undefined} alt={username} />
              <AvatarFallback>
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload new picture
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              className="bg-slate-700/50 border-[0.5px] border-slate-600"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !hasUnsavedChanges}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          {hasUnsavedChanges && (
            <Button
              type="button"
              variant={"destructive"}
              className="w-full"
              onClick={handleDiscardChanges}
            >
              Discard Changes
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
