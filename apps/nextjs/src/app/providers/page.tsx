// "use client";

// import { useEffect, useState } from "react";
// import { useGoogleLogin } from "@react-oauth/google";

// import { Button } from "~/components/ui/button";
// import { api } from "~/lib/utils/api";

// function Providers() {
//   const [authCode, setAuthCode] = useState("");
//   const googleLogin = useGoogleLogin({
//     flow: "auth-code",
//     scope: "https://www.googleapis.com/auth/gmail.modify",
//     onSuccess: (codeResponse) => {
//       console.log(codeResponse);
//       setAuthCode(codeResponse.code);
//       // if (typeof codeResponse == CodeResponse)

//       // console.log(token);
//       // const { isLoading, error, data } = useQuery('repoData', () =>
//       //   fetch('https://api.github.com/repos/tannerlinsley/react-query').then(res =>
//       //     res.json()
//       //   )
//       // )
//     },
//     onError: (errorResponse) => console.log(errorResponse),
//   });
//   const { mutateAsync: getToken } =
//     api.emailProviderRouter.getToken.useMutation({
//       onSuccess() {
//         console.log("first");
//       },
//     });

//   useEffect(() => {
//     if (authCode !== "") {
//       // eslint-disable-next-line @typescript-eslint/no-floating-promises
//       getToken({ code: authCode, provider: "gmail" }).then((val) =>
//         console.log(val),
//       );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authCode]);

//   return (
//     <div>
//       Available Providers:
//       <div>
//         <Button onClick={() => googleLogin()}>Connect to gmail</Button>
//       </div>
//     </div>
//   );
// }

// export default Providers;
