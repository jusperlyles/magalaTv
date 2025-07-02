import { useState } from "react";
import { Shield, Plus, Upload, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminControls() {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const { toast } = useToast();
  
  // Mock admin check - in a real app this would come from authentication context
  const isAdmin = false; // Set to true to show admin controls
  
  if (!isAdmin) {
    return null;
  }

  const handleAdminAction = (action: string) => {
    switch (action) {
      case "new-article":
        toast({
          title: "Coming Soon",
          description: "Article creation interface will be available soon!",
        });
        break;
      case "upload-media":
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*,video/*';
        input.onchange = (e) => {
          const files = Array.from((e.target as HTMLInputElement).files || []);
          toast({
            title: "Files Selected",
            description: `${files.length} files ready for upload`,
          });
        };
        input.click();
        break;
      case "manage-comments":
        toast({
          title: "Coming Soon",
          description: "Comment management interface will be available soon!",
        });
        break;
      case "send-notifications":
        toast({
          title: "Coming Soon", 
          description: "Notification system will be available soon!",
        });
        break;
    }
  };

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 flex flex-col items-end z-50">
      {isAdminPanelOpen && (
        <Card className="mb-2 border-yellow-300 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-800 text-sm border-b border-yellow-300 pb-2">
              Admin Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              <Button
                onClick={() => handleAdminAction("new-article")}
                variant="outline"
                className="w-full justify-start bg-white hover:bg-yellow-50 text-yellow-800 border-yellow-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Button>
              <Button
                onClick={() => handleAdminAction("upload-media")}
                variant="outline"
                className="w-full justify-start bg-white hover:bg-yellow-50 text-yellow-800 border-yellow-200"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
              <Button
                onClick={() => handleAdminAction("manage-comments")}
                variant="outline"
                className="w-full justify-start bg-white hover:bg-yellow-50 text-yellow-800 border-yellow-200"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Manage Comments
              </Button>
              <Button
                onClick={() => handleAdminAction("send-notifications")}
                variant="outline"
                className="w-full justify-start bg-white hover:bg-yellow-50 text-yellow-800 border-yellow-200"
              >
                <Bell className="mr-2 h-4 w-4" />
                Send Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg"
      >
        <Shield className="h-5 w-5" />
      </Button>
    </div>
  );
}
