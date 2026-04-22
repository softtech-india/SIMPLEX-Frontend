import { GetStaticProps } from 'next';
//import Login from '../modules/admin/users/login';
import PageHead from '@/common/components/PageHead';
import Login from '@/features/auth/login';

interface LoginPageProps {
  pageTitle: string;
}

export const getStaticProps: GetStaticProps<LoginPageProps> = async () => {
  return {
    props: {
      pageTitle: "Login",
    },
  };
};

export default function Home({ pageTitle }: LoginPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="Welcome to SIMPLEX" />
      <div>
        <Login />
      </div>
    </>
  );
}
