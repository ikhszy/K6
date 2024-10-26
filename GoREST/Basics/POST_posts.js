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
    const pre = http.get('https://gorest.co.in/public/v2/users', params)

    check(pre, {
        'GET status is correct': (r) => pre.status === 200
    })

    const preData = pre.json();
    console.log(preData[0].id)

    // setup request body for posts
    const title = faker.company.catchPhrase()
    const body = faker.lorem.paragraph()

    const reqBody = {
        user_id: preData[0].id,
        title: title,
        body: body
    }

    console.log(reqBody);

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