import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getGalleryById } from "@/services/galleryService";
import { getThumbnailUrl } from "@/lib/cloudinary";
import { Loader2, Images as ImagesIcon, ChevronLeft, X, ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon } from "lucide-react";

const GalleryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { data: gallery, isLoading, isError } = useQuery({
    queryKey: ["gallery", id],
    queryFn: () => getGalleryById(id!),
    enabled: !!id,
  });

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && gallery) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? gallery.images.length - 1 : selectedImageIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && gallery) {
      setSelectedImageIndex(
        selectedImageIndex === gallery.images.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;
    if (e.key === "ArrowLeft") handlePrevImage();
    if (e.key === "ArrowRight") handleNextImage();
    if (e.key === "Escape") setSelectedImageIndex(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !gallery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <ImagesIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-serif mb-4">Không tìm thấy bộ sưu tập</h1>
            <p className="text-muted-foreground mb-6">
              Bộ sưu tập bạn đang tìm không tồn tại hoặc chưa được công khai.
            </p>
            <Button onClick={() => navigate("/galleries")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link to="/galleries" className="hover:text-foreground transition-colors">
              Bộ sưu tập
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-foreground truncate">{gallery.title}</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {gallery.title}
            </h1>
            <p className="text-muted-foreground">
              {gallery.images.length} ảnh • Được tạo ngày{" "}
              {new Date(gallery.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {/* Description */}
          {gallery.description && (
            <div
              className="prose prose-lg max-w-none mb-12 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: gallery.description }}
            />
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted hover:shadow-lg transition-all"
              >
                <img
                  src={getThumbnailUrl(image.publicId, 400, 400)}
                  alt={`${gallery.title} - Ảnh ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-12">
            <Button variant="outline" onClick={() => navigate("/galleries")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại bộ sưu tập
            </Button>
          </div>
        </div>
      </main>

      {/* Image Lightbox */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={() => setSelectedImageIndex(null)}
      >
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95"
          onKeyDown={(e: any) => handleKeyDown(e)}
        >
          {selectedImageIndex !== null && gallery.images[selectedImageIndex] && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Previous Button */}
              {gallery.images.length > 1 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
              )}

              {/* Image */}
              <img
                src={gallery.images[selectedImageIndex].url}
                alt={`${gallery.title} - Ảnh ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
              />

              {/* Next Button */}
              {gallery.images.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
                {selectedImageIndex + 1} / {gallery.images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default GalleryDetail;
