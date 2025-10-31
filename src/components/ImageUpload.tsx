import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { uploadProductImages, validateImageFile, compressImage } from "@/services/imageUploadService";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check max images limit
    if (images.length + files.length > maxImages) {
      toast.error(`Chỉ được upload tối đa ${maxImages} ảnh`);
      return;
    }

    setUploading(true);

    try {
      const fileArray = Array.from(files);

      // Validate all files
      for (const file of fileArray) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error || "File không hợp lệ");
          setUploading(false);
          return;
        }
      }

      // Compress images
      toast.info("Đang nén ảnh...");
      const compressedFiles = await Promise.all(
        fileArray.map(file => compressImage(file))
      );

      // Upload images
      toast.info("Đang upload ảnh...");
      const uploadedUrls = await uploadProductImages(compressedFiles);

      onImagesChange([...images, ...uploadedUrls]);
      toast.success(`Đã upload ${uploadedUrls.length} ảnh thành công!`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Lỗi khi upload ảnh. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success("Đã xóa ảnh");
  };

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={uploading || images.length >= maxImages}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Đang upload ảnh...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, WebP, GIF (tối đa 5MB mỗi ảnh)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxImages}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Chọn ảnh
              </Button>
              <p className="text-xs text-muted-foreground">
                {images.length}/{maxImages} ảnh
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-3">
            Ảnh đã upload ({images.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((url, index) => (
              <Card
                key={index}
                className="relative group overflow-hidden aspect-square cursor-move"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", index.toString());
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                  handleReorder(fromIndex, index);
                }}
              >
                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground shadow-md">
                      Ảnh chính
                    </span>
                  </div>
                )}

                {/* Image */}
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Index */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-background/90 text-foreground">
                    #{index + 1}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            💡 Tip: Kéo thả để sắp xếp lại thứ tự ảnh. Ảnh đầu tiên sẽ là ảnh chính.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
