import { blogApi, categoryApi } from "@/apis"

export default async function Category () {
  const { data } = await blogApi.countCategory();
  const { data: dataCate } = await categoryApi.getList();
  console.log(data);
  console.log(dataCate);
  
  
  return (
    <div>Category</div>
  )
}