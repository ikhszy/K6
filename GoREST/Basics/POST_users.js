import http from 'k6/http';
import { check } from 'k6';

export default function() {

    const token = 'e55d0d0efc3ed6c08de87539d678e794ce71d85de89fb6ac830976b723d296be'
    const cred = {
        name: 'john_ocean',
        email: 'john_ocean@oceano.co.cn',
        gender: 'male',
        status: 'active'
    }

    const params = {
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        }
    };

    const res = http.post('https://gorest.co.in/public/v2/users', 
        JSON.stringify(cred),
        params
    );

    check(res, {
        'status is correct': (r) => res.status === 201,
        'contains id': (r) => res.body.includes('id')
    });

    console.log(res.json().id);
}