import http from 'k6/http';
import { check } from 'k6';
import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';

export default function() {

    const token = __ENV.TOKEN;
    const reqBody = {
        name: faker.name.firstName() + " " + faker.name.lastName(),
        email: faker.internet.email(),
        gender: 'male',
        status: 'active'
    }

    const params = {
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        }
    };

    console.log(reqBody);

    const res = http.post('https://gorest.co.in/public/v2/users', 
        JSON.stringify(reqBody),
        params
    );

    check(res, {
        'status is correct': (r) => res.status === 201,
        'contains id': (r) => res.body.includes('id')
    });

    console.log(res.json().id);
}