// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';
import { contacts } from './data.js';

export const handlers = [
  http.get(
    'https://65b36193770d43aba479a2f2.mockapi.io/users/:id',
    ({ request, params }) => {
      return HttpResponse.json(contacts.find((item) => item.id == params.id));
    }
  ),
  http.get(
    'https://65b36193770d43aba479a2f2.mockapi.io/users',
    ({ request }) => {
      return HttpResponse.json(contacts);
    }
  ),
  http.delete(
    'https://65b36193770d43aba479a2f2.mockapi.io/users/:id',
    ({ request, params }) => {
      contacts = contacts.filter((item) => item.id != params.id);
      return HttpResponse.json(contacts);
    }
  ),
  http.post(
    'https://65b36193770d43aba479a2f2.mockapi.io/users',
    async ({ request }) => {
      const info = await request.json();
      const newContact = {
        ...info,
        createdAt: '2024-01-25T20:56:11.456Z',
        desc: 'lorem',
        id: '11',
      };
      contacts.push(newContact);
      return HttpResponse.json(newContact);
    }
  ),
];
