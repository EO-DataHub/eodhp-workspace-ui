import { HttpResponse, http } from 'msw';

import { getData } from '../fixtures/app';

const API_URL = '/api/tokens';

const getAppData = http.get(`*${API_URL}*`, () => HttpResponse.json(getData()));

const handlers = [getAppData];

export default handlers;