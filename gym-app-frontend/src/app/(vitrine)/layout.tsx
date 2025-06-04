import Footer from "@/components/vitrine/Footer";
import Navbar from "@/components/vitrine/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer></Footer>
    </>
  );
}
