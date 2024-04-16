import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

export default () => {

    const [posts, setPosts] = useState({});

    const getPosts = async () => {
        await axios({
            method: 'get',
            url: 'http://posts.com:3600/posts'
        }).then((res: any) => {
            setPosts(() => res.data);
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getPosts();
    }, []);

    const renderPosts = Object.values(posts).map((post: any) => {
        return (<PostCard key={post.id} post={post} />);
        // return <></>
    });

    return (
        <div>
        <h1>Post List</h1>
        <div className="d-flex flex-row flex-wrap justify-content-between">
            {renderPosts} 
        </div>
        </div>
    )
}