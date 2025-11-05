import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Heading, Link, List, Image, ImageUpload, Base64UploadAdapter } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useCloudinaryUpload, useCloudinaryEditor } from "@/hooks/useCloudinary";
import { createGallery, updateGallery, type Gallery, type CreateGalleryData, type UpdateGalleryData } from "@/services/galleryService";
import type { CloudinaryImage } from "@/lib/cloudinary";
import { getThumbnailUrl } from "@/lib/cloudinary";
import { toast } from "sonner";
import { Upload, Pencil, Trash2, Loader2, Eye, Save } from "lucide-react";

interface GalleryFormProps {
  gallery?: Gallery;
  onSuccess?: () => void;
}

const GalleryForm = ({ gallery, onSuccess }: GalleryFormProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(gallery?.title || "");
  const [description, setDescription] = useState(gallery?.description || "");
  const [images, setImages] = useState<CloudinaryImage[]>(gallery?.images || []);
  const [isPublished, setIsPublished] = useState(gallery?.is_published || false);

  const { openUploadWidget, isLoaded: uploadWidgetLoaded } = useCloudinaryUpload();
  const { editImage, isLoaded: editorLoaded } = useCloudinaryEditor();

  // Update form when gallery prop changes
  useEffect(() => {
    if (gallery) {
      setTitle(gallery.title);
      setDescription(gallery.description || "");
      setImages(gallery.images || []);
      setIsPublished(gallery.is_published);
    }
  }, [gallery]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateGalleryData) => createGallery(data),
    onSuccess: () => {
      toast.success("Bộ sưu tập đã được tạo thành công!");
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      // Reset form
      setTitle("");
      setDescription("");
      setImages([]);
      setIsPublished(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGalleryData }) =>
      updateGallery(id, data),
    onSuccess: () => {
      toast.success("Bộ sưu tập đã được cập nhật!");
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      queryClient.invalidateQueries({ queryKey: ["gallery", gallery?.id] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  // Handle upload images
  const handleUploadImages = async () => {
    try {
      const uploadedImages = await openUploadWidget({
        folder: "galleries",
        multiple: true,
        maxFiles: 20,
      });

      if (uploadedImages.length > 0) {
        setImages([...images, ...uploadedImages]);
        toast.success(`Đã upload ${uploadedImages.length} ảnh`);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Lỗi khi upload ảnh");
    }
  };

  // Handle edit image
  const handleEditImage = async (index: number) => {
    const image = images[index];
    try {
      const editedImage = await editImage(image.publicId);
      const newImages = [...images];
      newImages[index] = editedImage;
      setImages(newImages);
      toast.success("Ảnh đã được chỉnh sửa");
    } catch (error: any) {
      if (error.message !== "Media editor cancelled") {
        console.error("Edit error:", error);
        toast.error("Lỗi khi chỉnh sửa ảnh");
      }
    }
  };

  // Handle delete image
  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    toast.success("Đã xóa ảnh");
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bộ sưu tập");
      return;
    }

    if (images.length === 0) {
      toast.error("Vui lòng upload ít nhất 1 ảnh");
      return;
    }

    const formData = {
      title: title.trim(),
      description: description.trim() || undefined,
      images,
      is_published: isPublished,
    };

    if (gallery) {
      updateMutation.mutate({ id: gallery.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {gallery ? "Chỉnh sửa bộ sưu tập" : "Tạo bộ sưu tập mới"}
          </CardTitle>
          <CardDescription>
            Tạo và quản lý bộ sưu tập ảnh với mô tả chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tên bộ sưu tập *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Bộ sưu tập gốm Bizen mùa thu 2024"
              required
            />
          </div>

          {/* Description with CKEditor */}
          <div className="space-y-2">
            <Label>Mô tả chi tiết</Label>
            <div className="border rounded-md overflow-hidden">
              <CKEditor
                editor={ClassicEditor}
                config={{
                  plugins: [
                    Essentials, Bold, Italic, Paragraph, Undo, Heading, Link, List,
                    Image, ImageUpload, Base64UploadAdapter,
                  ],
                  toolbar: [
                    'undo', 'redo', '|',
                    'heading', '|',
                    'bold', 'italic', '|',
                    'link', 'bulletedList', 'numberedList', '|',
                    'imageUpload',
                  ],
                  heading: {
                    options: [
                      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                    ],
                  },
                }}
                data={description}
                onChange={(_event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Bạn có thể định dạng văn bản và chèn ảnh trực tiếp vào mô tả
            </p>
          </div>

          {/* Upload Images */}
          <div className="space-y-3">
            <Label>Ảnh bộ sưu tập *</Label>
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadImages}
              disabled={!uploadWidgetLoaded || isLoading}
              className="w-full sm:w-auto"
            >
              {uploadWidgetLoaded ? (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload ảnh
                </>
              ) : (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tải widget...
                </>
              )}
            </Button>

            {/* Images Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden border bg-muted"
                  >
                    <img
                      src={getThumbnailUrl(image.publicId, 300, 300)}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(image.url, "_blank")}
                        title="Xem ảnh gốc"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditImage(index)}
                        disabled={!editorLoaded}
                        title="Chỉnh sửa ảnh"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(index)}
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {image.width} x {image.height}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {images.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Chưa có ảnh nào. Nhấn "Upload ảnh" để thêm ảnh.
              </p>
            )}
          </div>

          {/* Publish Switch */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="publish">Công khai bộ sưu tập</Label>
              <p className="text-sm text-muted-foreground">
                Cho phép người dùng xem bộ sưu tập này
              </p>
            </div>
            <Switch
              id="publish"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {gallery ? "Cập nhật" : "Tạo mới"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default GalleryForm;
