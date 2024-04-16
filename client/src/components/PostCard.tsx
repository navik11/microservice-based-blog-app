import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

interface Post {
    post: any;
}

export default ({post}: Post) => {
    return (
        <div className="postCard" style={{border:"1px solid black"}}>
        <h3>{post.title}</h3>
        <CommentList comments={post.comments} />
        <CommentCreate id={post.id} />
        </div>
    )
}   