import { useRouter } from "next/router";

function ErrorPage({ statusCode }) {
  const router = useRouter();

  if (statusCode === 401) {
    router.push("/");
    return null;
  }
}

ErrorPage.getInitialProps = ({ res, err }) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
