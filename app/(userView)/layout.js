import Footer from "../components/sharedComponents/Footer/Footer";
import Header from "../components/sharedComponents/Header/Header";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-50">
        <Header />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
