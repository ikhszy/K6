import http from 'k6/http';
import { check, group } from 'k6';

/*
    Smoke test consist of only 1 VU
    and it should be very simple
    checking only some of the simplest API
    that users usually used.

    group it according to each API to measure it easily.

    related APIs are:
    1. POST users
    2. POST posts
    3. POST comments
    4. POST todos
*/

// setting up options
export const options = {
    // virtual users and duration
    vus: 1,
    duration: '30s',

    /* 
    setup threshold
    i want it to be a maximum of 1 second
    */
    thresholds: {
        http_req_duration: ['p(90) < 1000'],
        'group_duration{group:::POST_users}': ['p(90) < 1000'],
        'group_duration{group:::POST_posts}': ['p(90) < 1000'],
        'group_duration{group:::POST_comments}': ['p(90) < 1000']
    }
}

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

    // define data
    let usersId, postsId;

    // setup request body for POST users
    const usersBody = {
        name: 'john_ocean' + Math.random() * 10,
        email: 'john_ocean' + + Math.random() * 10 +'@oceano.co.cn',
        gender: 'male',
        status: 'active'
    }

    // group and POST users
    group('POST_users', function() {
        const postUsers = http.post('https://gorest.co.in/public/v2/users', 
            JSON.stringify(usersBody),
            params
        );

        check(postUsers, {
            'status is correct': (r) => postUsers.status === 201,
            'contains id': (r) => postUsers.body.includes('id')
        });

        // define usersId from POST users response 
        usersId = postUsers.json().id;
    })

    // setup request body for POST posts
    const title = 'title_' + Math.random() * 10
    const body = 'body_' + Math.random() * 10

    const postsBody = {
        user_id: usersId,
        title: title,
        body: body
    }

    // group and POST posts
    group('POST_posts', function() {
        const postPosts = http.post('https://gorest.co.in/public/v2/posts',
            JSON.stringify(postsBody),
            params
        )
    
        check(postPosts, {
            'POST status is correct': (r) => postPosts.status === 201,
            'sent data is correct': (r) => postPosts.json().title === title
        })

        // define postsId from POST posts response
        postsId = postPosts.json().id;
    })

    // setup request body for POST comments
    const postId = postsId
    let postName = usersBody.name
    let postEmail = usersBody.email
    let postBody = postsBody.body

    const commentsBody = {
        post_id: postId,
        name: postName,
        email: postEmail,
        body: postBody
    }

    // group and POST comments
    group('POST_comments', function() {
        const postComments = http.post(`https://gorest.co.in/public/v2/posts/${postsId}/comments`,
            JSON.stringify(commentsBody),
            params
        )
    
        check(postComments, {
            'status is correct': (r) => postComments.status === 201,
            'data is correct': (r) => postComments.body.includes(postName)
        })
    })
}