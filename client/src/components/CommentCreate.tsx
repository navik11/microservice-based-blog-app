import axios from "axios";
import { useState } from "react";

export default ({id}: {id: string}) => {

    const [content, setContent] = useState('');

    const createComment = async (e: React.FormEvent) => {
        console.log(id);
        e.preventDefault();
        try {
            await axios({
                method: 'post',
                url: `http://posts.com:3600/posts/${id}/comments`,
                data: {
                    content
                }
            });
        } catch (error) {
            console.log(error)
        }
        setContent(() => '');
    }

    return (
        <div>
        <form onSubmit={createComment}>
            <div className="form-group">
            <input className="form-control" value={content} onChange={(e) => {setContent(() => e.target.value)}}/>
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>
        </div>
    );
}