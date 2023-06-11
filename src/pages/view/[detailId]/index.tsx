import { useRouter } from "next/router"

const Test = () => {
  const router = useRouter();
  const {detailId} = router.query;
  // console.log(JSON.parse(detailId as s));

  return (
    <h1>Ok</h1>
  )
}

export default Test