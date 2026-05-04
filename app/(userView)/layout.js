import Footer from "../components/sharedComponents/Footer/Footer";
import Header from "../components/sharedComponents/Header/Header";

export default function UserLayout({ children }) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header>
            <Header />
        </header>
        <main>{children}</main>
        <footer>
            <Footer />
        </footer>
      </body>
    </html>
  );
}
