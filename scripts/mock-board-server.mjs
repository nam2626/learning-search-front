import http from 'node:http';

const PORT = Number(process.env.MOCK_BOARD_PORT || 8787);
const demoUser = { email: 'demo@local.test', nickname: '데모 학습자', grade: 2 };
let sequence = 20;

const now = () => new Date().toISOString();
const questions = [
  {
    id: 'question-1',
    title: '이차방정식의 근의 공식에서 판별식은 왜 필요한가요?',
    content: '근의 공식을 적용하는 과정은 이해했는데, 판별식의 부호가 근의 개수와 어떻게 연결되는지 직관적으로 알고 싶습니다.',
    authorNickname: '데모 학습자',
    status: 'WAITING',
    acceptedAnswerId: null,
    createdAt: '2026-10-14T00:30:00.000Z',
    updatedAt: '2026-10-14T00:30:00.000Z',
    canEdit: true,
    canDelete: true,
    answers: [],
  },
  {
    id: 'question-2',
    title: '자바 스트림 map과 flatMap의 차이가 궁금합니다',
    content: '중첩된 리스트를 다룰 때 flatMap을 쓰라고 하는데, map을 연속으로 호출하는 것과 어떤 차이가 있나요? 짧은 예시도 부탁드립니다.',
    authorNickname: '코드초보',
    status: 'ANSWERED',
    acceptedAnswerId: null,
    createdAt: '2026-10-13T05:10:00.000Z',
    updatedAt: '2026-10-13T07:40:00.000Z',
    canEdit: false,
    canDelete: false,
    answers: [
      {
        id: 'answer-1',
        content: 'map은 각 원소를 다른 값으로 바꾸고, flatMap은 변환 결과로 나온 여러 스트림을 하나로 펼칩니다. List<List<String>>를 Stream<String>으로 만들 때 flatMap(List::stream)을 쓰는 이유입니다.',
        authorNickname: '데모 학습자',
        accepted: false,
        createdAt: '2026-10-13T07:40:00.000Z',
        updatedAt: '2026-10-13T07:40:00.000Z',
        canEdit: true,
        canDelete: true,
        canAccept: false,
      },
    ],
  },
  {
    id: 'question-3',
    title: '영어 현재완료와 과거시제 구분하는 기준',
    content: '둘 다 과거의 일을 말하는 것처럼 보여서 헷갈립니다. 문장에서 빠르게 구분할 수 있는 기준이 있을까요?',
    authorNickname: '문법탐험가',
    status: 'RESOLVED',
    acceptedAnswerId: 'answer-2',
    createdAt: '2026-10-12T02:00:00.000Z',
    updatedAt: '2026-10-12T04:15:00.000Z',
    canEdit: false,
    canDelete: false,
    answers: [
      {
        id: 'answer-2',
        content: '과거시제는 끝난 과거 시점을 말하고, 현재완료는 과거의 일이 현재와 연결되어 있다는 점이 핵심입니다. yesterday처럼 끝난 시점이 명확하면 보통 과거시제를 사용합니다.',
        authorNickname: '영어멘토',
        accepted: true,
        createdAt: '2026-10-12T04:15:00.000Z',
        updatedAt: '2026-10-12T04:15:00.000Z',
        canEdit: false,
        canDelete: false,
        canAccept: false,
      },
    ],
  },
];

function send(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  });
  response.end(body === undefined ? '' : JSON.stringify(body));
}

async function readBody(request) {
  let raw = '';
  for await (const chunk of request) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function detail(question) {
  return { ...question, answerCount: question.answers.length };
}

function summary(question) {
  const { id, title, authorNickname, status, createdAt, updatedAt } = question;
  return { id, title, authorNickname, status, answerCount: question.answers.length, createdAt, updatedAt };
}

function findQuestion(id) {
  return questions.find((question) => question.id === id);
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return send(response, 204);
  const url = new URL(request.url, `http://${request.headers.host}`);
  const path = url.pathname;

  try {
    if (request.method === 'POST' && path === '/api/auth/login') {
      return send(response, 200, { token: 'local-demo-token', user: demoUser });
    }
    if (request.method === 'GET' && path === '/api/auth/me') return send(response, 200, demoUser);
    if (request.method === 'POST' && path === '/api/auth/logout') return send(response, 204);

    if (path === '/api/board/questions' && request.method === 'GET') {
      const query = (url.searchParams.get('query') || '').toLocaleLowerCase('ko');
      const status = url.searchParams.get('status');
      const sort = url.searchParams.get('sort') || 'LATEST';
      const limit = Number(url.searchParams.get('limit') || 20);
      const offset = Number(url.searchParams.get('cursor') || 0);
      let filtered = questions.filter((item) =>
        (!query || `${item.title} ${item.content}`.toLocaleLowerCase('ko').includes(query)) &&
        (!status || item.status === status),
      );
      filtered = [...filtered].sort((a, b) => {
        if (sort === 'ANSWERS_ASC') return a.answers.length - b.answers.length;
        if (sort === 'ANSWERS_DESC') return b.answers.length - a.answers.length;
        return b.createdAt.localeCompare(a.createdAt);
      });
      const page = filtered.slice(offset, offset + limit);
      const nextOffset = offset + page.length;
      return send(response, 200, {
        items: page.map(summary),
        nextCursor: nextOffset < filtered.length ? String(nextOffset) : null,
        hasNext: nextOffset < filtered.length,
      });
    }

    if (path === '/api/board/questions' && request.method === 'POST') {
      const body = await readBody(request);
      const timestamp = now();
      const question = {
        id: `question-${++sequence}`,
        title: body.title,
        content: body.content,
        authorNickname: demoUser.nickname,
        status: 'WAITING',
        acceptedAnswerId: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        canEdit: true,
        canDelete: true,
        answers: [],
      };
      questions.unshift(question);
      return send(response, 201, detail(question));
    }

    const answerMatch = path.match(/^\/api\/board\/questions\/([^/]+)\/answers(?:\/([^/]+))?$/);
    if (answerMatch) {
      const question = findQuestion(answerMatch[1]);
      if (!question) return send(response, 404, { message: '질문을 찾을 수 없습니다.' });
      const answerId = answerMatch[2];
      if (request.method === 'POST' && !answerId) {
        const body = await readBody(request);
        const timestamp = now();
        const answer = {
          id: `answer-${++sequence}`,
          content: body.content,
          authorNickname: demoUser.nickname,
          accepted: false,
          createdAt: timestamp,
          updatedAt: timestamp,
          canEdit: true,
          canDelete: true,
          canAccept: question.canEdit,
        };
        question.answers.push(answer);
        question.status = 'ANSWERED';
        question.updatedAt = timestamp;
        return send(response, 201, answer);
      }
      const answer = question.answers.find((item) => item.id === answerId);
      if (!answer) return send(response, 404, { message: '답변을 찾을 수 없습니다.' });
      if (request.method === 'PUT') {
        const body = await readBody(request);
        answer.content = body.content;
        answer.updatedAt = now();
        return send(response, 200, answer);
      }
      if (request.method === 'DELETE') {
        question.answers = question.answers.filter((item) => item.id !== answerId);
        if (question.acceptedAnswerId === answerId) question.acceptedAnswerId = null;
        question.status = question.acceptedAnswerId ? 'RESOLVED' : question.answers.length ? 'ANSWERED' : 'WAITING';
        return send(response, 204);
      }
    }

    const acceptedMatch = path.match(/^\/api\/board\/questions\/([^/]+)\/accepted-answer(?:\/([^/]+))?$/);
    if (acceptedMatch) {
      const question = findQuestion(acceptedMatch[1]);
      if (!question) return send(response, 404, { message: '질문을 찾을 수 없습니다.' });
      if (request.method === 'PUT' && acceptedMatch[2]) {
        const answer = question.answers.find((item) => item.id === acceptedMatch[2]);
        if (!answer) return send(response, 404, { message: '답변을 찾을 수 없습니다.' });
        question.answers.forEach((item) => { item.accepted = item.id === answer.id; item.canAccept = false; });
        question.acceptedAnswerId = answer.id;
        question.status = 'RESOLVED';
        question.updatedAt = now();
        return send(response, 200, detail(question));
      }
      if (request.method === 'DELETE') {
        question.answers.forEach((item) => { item.accepted = false; item.canAccept = question.canEdit; });
        question.acceptedAnswerId = null;
        question.status = question.answers.length ? 'ANSWERED' : 'WAITING';
        question.updatedAt = now();
        return send(response, 200, detail(question));
      }
    }

    const questionMatch = path.match(/^\/api\/board\/questions\/([^/]+)$/);
    if (questionMatch) {
      const question = findQuestion(questionMatch[1]);
      if (!question) return send(response, 404, { message: '질문을 찾을 수 없습니다.' });
      if (request.method === 'GET') return send(response, 200, detail(question));
      if (request.method === 'PUT') {
        const body = await readBody(request);
        question.title = body.title;
        question.content = body.content;
        question.updatedAt = now();
        return send(response, 200, detail(question));
      }
      if (request.method === 'DELETE') {
        questions.splice(questions.indexOf(question), 1);
        return send(response, 204);
      }
    }

    return send(response, 404, { message: '요청한 경로를 찾을 수 없습니다.' });
  } catch (error) {
    return send(response, 500, { message: error instanceof Error ? error.message : '테스트 서버 오류' });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock Q&A API listening on http://127.0.0.1:${PORT}`);
});
