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
    const pre = http.get('https://gorest.co.in/public/v2/users', params)

    check(pre, {
        'GET status is correct': (r) => pre.status === 200
    })

    const preData = pre.json();
    console.log(preData[0].id)

    // setup request body for posts
    const title = 'new title'
    const body = 'new body'

    const reqBody = {
        user_id: preData[0].id,
        title: title,
        body: body
    }

    // do the posts
    const res = http.post('https://gorest.co.in/public/v2/posts',
        JSON.stringify(reqBody),
        params
    )

    check(res, {
        'POST status is correct': (r) => res.status === 201,
        'sent data is correct': (r) => res.json().title === title
    })
}