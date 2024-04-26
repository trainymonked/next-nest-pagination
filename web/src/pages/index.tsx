import { useEffect, useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  usersCount: number;
  users: TUserItem[];
};

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const resCount = await fetch(`http://localhost:3000/users/count`, { method: "GET" });
    if (!resCount.ok) {
      return { props: { statusCode: resCount.status, usersCount: 0, users: [] } };
    }

    const res = await fetch(`http://localhost:3000/users?page=${+(ctx.query.page ?? 1)}&count=20`, {
      method: "GET",
    });
    if (!res.ok) {
      return { props: { statusCode: res.status, usersCount: 0, users: [] } };
    }

    return {
      props: { statusCode: 200, usersCount: await resCount.json(), users: await res.json() },
    };
  } catch (e) {
    return { props: { statusCode: 500, usersCount: 0, users: [] } };
  }
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home({ statusCode, usersCount, users }: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: currentPage },
    });
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            itemsCount={usersCount}
            itemsPerPage={20}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Container>
      </main>
    </>
  );
}
