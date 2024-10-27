import http from 'k6/http';
import { check } from 'k6';
import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';

export default function() {

    // setup request headers
    const token = __ENV.TOKEN;
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
    let postName = faker.name.firstName()
    let postEmail = faker.internet.email()
    let postBody = faker.lorem.paragraph()

    const reqBody = {
        post_id: postId,
        name: postName,
        email: postEmail,
        body: postBody
    }

    console.log(reqBody);

    const comments = http.post(`https://gorest.co.in/public/v2/posts/${postId}/comments`,
        JSON.stringify(reqBody),
        params
    )

    check(comments, {
        'status is correct': (r) => comments.status === 201,
        'data is correct': (r) => comments.body.includes(postName)
    })
}