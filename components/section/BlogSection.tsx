import BlogPostCard from "../cards/BlogPostCard";
import EditorialSection from "./EditorialSection";

export default function BlogSection() {
  return (
    <EditorialSection title="From the blog">
      <BlogPostCard />
    </EditorialSection>
  );
}
