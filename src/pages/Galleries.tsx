import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedGalleries } from "@/services/galleryService";
import { Loader2, Images as ImagesIcon, ChevronRight } from "lucide-react";

const Galleries = () => {
  const { data: galleries, isLoading, isError } = useQuery({
    queryKey: ["published-galleries"],
    queryFn: getPublishedGalleries,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-12 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <ImagesIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Bộ Sưu Tập
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Khám phá những bộ sưu tập gốm sứ Nhật Bản độc đáo, mỗi tác phẩm đều
              mang trong mình câu chuyện riêng và nghệ thuật thủ công truyền thống
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-20">
              <ImagesIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-serif mb-2">Có lỗi xảy ra</h2>
              <p className="text-muted-foreground">
                Không thể tải bộ sưu tập. Vui lòng thử lại sau.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && galleries && galleries.length === 0 && (
            <div className="text-center py-20">
              <ImagesIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-serif mb-2">Chưa có bộ sưu tập nào</h2>
              <p className="text-muted-foreground">
                Các bộ sưu tập mới sẽ sớm được cập nhật. Vui lòng quay lại sau!
              </p>
            </div>
          )}

          {/* Galleries Grid */}
          {galleries && galleries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleries.map((gallery, index) => {
                const imageCount = gallery.images.length;
                const coverImage = gallery.images[0];

                return (
                  <Link
                    key={gallery.id}
                    to={`/galleries/${gallery.id}`}
                    className="group animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
                      {/* Cover Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {coverImage ? (
                          <img
                            src={coverImage.thumbnailUrl || coverImage.url}
                            alt={gallery.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImagesIcon className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-black/60 backdrop-blur-sm">
                            {imageCount} ảnh
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-primary transition-colors">
                          {gallery.title}
                        </h3>

                        {gallery.description && (
                          <div
                            className="text-muted-foreground text-sm line-clamp-3 mb-4"
                            dangerouslySetInnerHTML={{
                              __html: gallery.description
                                .replace(/<[^>]*>/g, " ")
                                .substring(0, 120) + "...",
                            }}
                          />
                        )}

                        <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                          Xem bộ sưu tập
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Galleries;
