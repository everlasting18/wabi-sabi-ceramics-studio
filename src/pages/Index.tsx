import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import USPSection from "@/components/USPSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <CategoryCards />
        <FeaturedProducts />
        <USPSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
