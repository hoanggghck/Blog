import { BlogDetailComment } from "./BlogDetailComment";
import { blogApi } from "@/apis";
import { BlogDetailContent } from "./BlogDetailContent";

const BlogDetailWrapper = async ({blogId}: {blogId: string}) => {
  const postId = blogId ? parseInt(blogId.split('-').pop() || '', 10) : 0;
  const { data } = await blogApi.getDetail(postId);
  const blog = data.result;

  if (!blog) return <p>Không có dữ liệu hiển thị</p>
  return (
    <div className="md:p-5 p-3">
      <article className="max-w-4xl mx-auto">
        <BlogDetailContent blog={blog} />
        <BlogDetailComment
          blogId={blog.id ?? 0}
        />
      </article>
    </div>
  )
}

export default BlogDetailWrapper
