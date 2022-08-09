import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import Picture from "../components/Picture";

const Homepage = () => {
  let [input, setInput] = useState("");
  let [data, setData] = useState([]);
  let [page, setPage] = useState(1);
  let [currentSearch, setCurrentSearch] = useState("");
  const auth = "563492ad6f91700001000001d4a258a2c9fd491caa9090c2ff2c37d5";
  const intialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15";
  const searchURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=1`;
  //fetch data from pexels API
  const search = async (url) => {
    setPage(2);
    const dataFatch = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    });
    let parseData = await dataFatch.json();
    setData(parseData.photos);
  };

  //Load more picture
  const morepicture = async () => {
    let newURL;
    if (input === "") {
      newURL = `https://api.pexels.com/v1/curated?page=${page}&per_page=15`;
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${input}&per_page=15&page=${page}`;
    }
    setPage(page + 1);
    const dataFatch = await fetch(newURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    });
    let parseData = await dataFatch.json();
    setData(data.concat(parseData.photos));
  };
  //fetch data when loadup homepage
  useEffect(() => {
    search(intialURL);
  }, []);
  useEffect(() => {
    if (currentSearch === "") {
      search(intialURL);
    } else {
      search(searchURL);
    }
  }, [currentSearch]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Search
        search={() => {
          setCurrentSearch(input);
        }}
        setInput={setInput}
      />
      <div className="pictures">
        {data &&
          data.map((d) => {
            return <Picture data={d} />;
          })}
      </div>

      <div className="morePicture">
        <button onClick={morepicture}>Load More</button>
      </div>
    </div>
  );
};

export default Homepage;
