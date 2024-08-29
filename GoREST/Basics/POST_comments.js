import http from 'k6/http';
import { check } from 'k6';

export default function() {
    
    // setup request headers
    const token = 'e55d0d0efc3ed6c08de87539d678e794ce71d85de89fb6ac830976b723d296be'
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    // get userId
    const user = http.get('https://gorest.co.in/public/v2/users', params)

    check(user, {
        'GET status is correct': (r) => user.status === 200
    })

    const userData = user.json();
    console.log(userData[0].id)

    // get postsId
    const posts = http.get('https://gorest.co.in/public/v2/posts', params)

    check(posts, {
        'GET status is correct': (r) => posts.status === 200
    })

    const postsData = posts.json();
    console.log(postsData[0].id)
    
    // setup request body for posts
    const postId = postsData[0].id
    let postName = userData[0].name
    let postEmail = userData[0].email
    let postBody = postsData[0].body

    const reqBody = {
        post_id: postId,
        name: postName,
        email: postEmail,
        body: postBody
    }

    const comments = http.post(`https://gorest.co.in/public/v2/posts/${postId}/comments`,
        JSON.stringify(reqBody),
        params
    )

    check(comments, {
        'status is correct': (r) => comments.status === 201,
        'data is correct': (r) => comments.body.includes(postName)
    })
}