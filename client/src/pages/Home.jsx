import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolution from "@/components/landing/ProblemSolution";
import HowItWorks from "@/components/landing/HowItWorks";
import InstantAnalysis from "@/components/landing/InstantAnalysis";
import Roadmap from "@/components/landing/Roadmap";
import Services from "@/components/landing/Services";
import KPIAnalytics from "@/components/landing/KPIAnalytics";
import PDFReport from "@/components/landing/PDFReport";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import DashboardPreview from "@/components/landing/DashboardPreview";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      {/* <main> — Lighthouse "document does not have a main landmark" auditi
          va skrin-riderlar uchun asosiy kontent chegarasi. */}
      <main id="main">
        <HeroSection />
        <ProblemSolution />
        <HowItWorks />
        <InstantAnalysis />
        <Roadmap />
        <Services />
        <KPIAnalytics />
        <PDFReport />
        <Testimonials />
        <Pricing />
        <FAQ />
        <DashboardPreview />
      </main>
      <Footer />
    </div>
  );
}
