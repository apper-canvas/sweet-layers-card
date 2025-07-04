import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-vanilla flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;