import React from 'react';

import { beforeEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { server } from '../mocks/server';
import 'mutationobserver-shim';

import App from '../App';

import { BrowserRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';

const appFile = fs
  .readFileSync(path.resolve(__dirname, '../App.jsx'), 'utf8')
  .replaceAll(/(?:\r\n|\r|\n| )/g, '');

const sideBarFile = fs
  .readFileSync(path.resolve(__dirname, '../components/SideBar.jsx'), 'utf8')
  .replaceAll(/(?:\r\n|\r|\n| )/g, '');

const contactFile = fs
  .readFileSync(path.resolve(__dirname, '../components/Contact.jsx'), 'utf8')
  .replaceAll(/(?:\r\n|\r|\n| )/g, '');

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  document.body.innerHTML = '';
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});

const tanStackQuery =
  appFile.includes('<QueryClientProvider') &&
  !sideBarFile.includes('useEffect(()=>{') &&
  !contactFile.includes('useEffect(()=>{')
    ? 'Implemented'
    : 'Once tanStackQueryi ekleyin ve useEffectleri Contact ve SideBardan kaldırın';

test('App.jsxe QueryClientProvider eklenmiş', () => {
  expect(appFile).toContain('<QueryClientProvider');
});

test('SideBar componentinde useEffect kaldırılmış', () => {
  expect(sideBarFile).not.toContain('useEffect(()=>{');
});

test('Contact componentinde useEffect kaldırılmış', () => {
  expect(contactFile).not.toContain('useEffect(()=>{');
});

test('Contactlar listeleniyor', async () => {
  expect(tanStackQuery).toBe('Implemented');
  const users = await screen.findAllByTestId('contact');
  expect(users).toHaveLength(5);
});

test('New Butonu Çalışıyor', async () => {
  expect(tanStackQuery).toBe('Implemented');
  const user = userEvent.setup();
  await user.click(await screen.findByText('New'));
  await screen.findByPlaceholderText('First');
});

test('Yeni kullanıcı kayıt ediliyor', async () => {
  expect(tanStackQuery).toBe('Implemented');
  const user = userEvent.setup();
  await user.type(await screen.findByPlaceholderText('First'), 'Emre');
  await user.type(await screen.findByPlaceholderText('Last'), 'Sahiner');
  await user.type(
    await screen.findByPlaceholderText('@wit.com.tr'),
    'emre@wit.com.tr'
  );
  await user.type(
    await screen.findByPlaceholderText('https://example.com/avatar.jpg'),
    'https://picsum.photos/300'
  );
  await user.click(await screen.findByText('Save'));
  await screen.findByText('Emre Sahiner');
});

test('Home Butonu Çalışıyor', async () => {
  expect(tanStackQuery).toBe('Implemented');
  const user = userEvent.setup();
  await user.click(await screen.findByText('Home'));
  await screen.findByText('Welcome to WiTech Contacts');
});

test('Kullanıcı detaylarını gösteriyor', async () => {
  expect(tanStackQuery).toBe('Implemented');
  const user = userEvent.setup();
  const users = await screen.findAllByTestId('contact');
  await user.click(users[0]);
  await screen.findByTestId('full_name');
});

test('Kullanıcıyı siliyor', async () => {
  expect(tanStackQuery).toBe('Implemented');
  const user = userEvent.setup();
  const users = await screen.findAllByTestId('contact');
  await user.click(users[1]);
  await user.click(await screen.findByText('Delete'));
  await screen.findByText('Welcome to WiTech Contacts');
});
