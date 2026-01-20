import BlogCard from "@/components/blog/blog-card";
import { BlogType } from "@/types";

const ListBlog = ({ blogs }: {blogs: BlogType[]}) => {

  if (!blogs.length) {
    return (
      <p className="text-center text-gray-500 col-span-full">
        Chưa có bài viết
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {blogs.map((post) => ( 
        <BlogCard post={post} key={post.id} />
      ))}
    </div>
  )
}
export default ListBlog;