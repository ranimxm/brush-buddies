import { Helmet } from "react-helmet-async";
import { Loading } from "../components/loading";
import { useNavigate } from "react-router-dom";
import { pages } from "../util/pages";

export const Home = () => {
  const navigate = useNavigate();

  const handleLoadingComplete = () => {
    navigate({ pathname: pages.CANVAS });
  };

  const people = [
    { id: "1", name: "Sarah" },
    { id: "2", name: "Ranim" },
    { id: "3", name: "Olive" },
  ];

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <Loading onComplete={handleLoadingComplete} people={people} />
    </>
  );
};
