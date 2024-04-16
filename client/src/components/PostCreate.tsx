import axios from "axios";
import { useState } from "react";

export function PostCreate() {

    const [title, setTitle] = useState('');

    const createPost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios({
                method: 'post',
                url: 'http://posts.com:3600/posts/create',
                data: {
                    title
                }
            });
        } catch (error) {
            
        }
        setTitle(() => '');
    }

    return (
        <div>
        <h1>Create Post</h1>
        <form onSubmit={createPost}>
            <div className="form-group">
            <label>Title</label>
            <input className="form-control" value={title} onChange={(e) => {setTitle(() => e.target.value)}}/>
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>
        </div>
    );
}