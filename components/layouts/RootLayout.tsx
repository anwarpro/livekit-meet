import Footer from './Footer';

type Props = {
  children: string | JSX.Element | JSX.Element[];
};
const RootLayout = ({ children }: Props) => {
  return (
    <main>
      {children}
      <Footer />
    </main>
  );
};

export default RootLayout;
