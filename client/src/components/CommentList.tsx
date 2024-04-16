
export default ({comments}: {comments:any}) => {
    if(!comments) return <></>
    return <div>
        <h4>{comments.length } Comments</h4>
        <ul>
            {comments.map((comment: any) => {
                let content = comment.content;
                if(comment.status === 'rejected') {
                    content = 'This comment has been rejected';
                } else if(comment.status === 'pending') {
                    content = 'This comment is awaiting moderation';
                }
                return <li key={comment.id}>{content}</li>
            })}
        </ul>
    </div>
}