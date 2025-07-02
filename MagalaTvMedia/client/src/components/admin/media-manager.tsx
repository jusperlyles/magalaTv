import { useState } from "react";
import { Upload, Image, Video, File, Trash2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadedAt: string;
}

export default function MediaManager() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'kampala-city.jpg',
      url: 'https://images.unsplash.com/photo-1553847828-0518388e9b96?w=400',
      type: 'image',
      size: '2.4 MB',
      uploadedAt: '2025-01-02'
    },
    {
      id: '2',
      name: 'uganda-news.mp4',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
      type: 'video',
      size: '15.8 MB',
      uploadedAt: '2025-01-02'
    }
  ]);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Simulate file upload
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      
      setUploadedMedia(prev => [newMedia, ...prev]);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: `${name} URL copied to clipboard.`,
    });
  };

  const deleteMedia = (id: string) => {
    setUploadedMedia(prev => prev.filter(item => item.id !== id));
    toast({
      title: "File deleted",
      description: "Media file has been removed.",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const filterByType = (type: string) => {
    if (type === 'all') return uploadedMedia;
    return uploadedMedia.filter(item => item.type === type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Media Manager</h2>
        <p className="text-gray-600">Upload and manage photos, videos, and documents</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drag & drop files here, or click to select
            </h3>
            <p className="text-gray-500 mb-4">
              Supports images (JPG, PNG, GIF), videos (MP4, MOV), and documents (PDF, DOC)
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="cursor-pointer" asChild>
                <span>Choose Files</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Media Library */}
      <Card>
        <CardHeader>
          <CardTitle>Media Library ({uploadedMedia.length} files)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <MediaGrid media={filterByType('all')} onCopy={copyToClipboard} onDelete={deleteMedia} />
            </TabsContent>
            <TabsContent value="image" className="mt-6">
              <MediaGrid media={filterByType('image')} onCopy={copyToClipboard} onDelete={deleteMedia} />
            </TabsContent>
            <TabsContent value="video" className="mt-6">
              <MediaGrid media={filterByType('video')} onCopy={copyToClipboard} onDelete={deleteMedia} />
            </TabsContent>
            <TabsContent value="document" className="mt-6">
              <MediaGrid media={filterByType('document')} onCopy={copyToClipboard} onDelete={deleteMedia} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface MediaGridProps {
  media: MediaItem[];
  onCopy: (url: string, name: string) => void;
  onDelete: (id: string) => void;
}

function MediaGrid({ media, onCopy, onDelete }: MediaGridProps) {
  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No media files found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((item) => (
        <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : item.type === 'video' ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <Video className="h-8 w-8 text-white" />
                <Badge className="absolute top-2 right-2 bg-black/75 text-white">
                  Video
                </Badge>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <File className="h-8 w-8 text-gray-400" />
                <Badge className="mt-2">Document</Badge>
              </div>
            )}
          </div>
          
          <div className="p-3">
            <h4 className="font-medium text-sm truncate" title={item.name}>
              {item.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {item.size} • {item.uploadedAt}
            </p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopy(item.url, item.name)}
                  className="h-7 px-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(item.url, '_blank')}
                  className="h-7 px-2"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="h-7 px-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}