import Users from '../../modules/admin/users';

export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Users"
        }
    }
}

export default function UsersPage() {
  return (
    <div>
      <Users />
    </div>
  );
}
