import { blogApi } from "@/apis";

export default async function Category () {
  const { data } = await blogApi.countCategory();
  console.log(data);
  
  return (
    <div>Category</div>
  )
}