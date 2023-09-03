"use client";

import { useEffect, useState } from "react";

import { client } from "~/utils/api";

function Page() {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    client.blank.hello
      .query()
      .then((val) => setGreeting(val))
      .catch((e) => console.log(e));
  }, []);
  return <div>{greeting}</div>;
}

export default Page;
