import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { createApp } from '../app.js';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { EventRegistration } from '../models/EventRegistration.js';
import { ContactMessage } from '../models/ContactMessage.js';

await connectDatabase();
const app = createApp();
const srv = app.listen(5056);
const base = 'http://localhost:5056/api';

try {
  const adminEmail = 'qa.superadmin@fcit.test';
  const adminPass = 'StrongQaPass!2026';
  await User.deleteMany({ email: { $in: [adminEmail, 'qa.student@fcit.test'] } });
  await User.create({
    name: 'QA Super Admin',
    email: adminEmail,
    passwordHash: await bcrypt.hash(adminPass, 10),
    role: 'super_admin',
  });

  // 1. Unauthenticated write blocked
  let r = await fetch(`${base}/faculty`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', designation: 'Prof' }),
  });
  assert.equal(r.status, 401, 'Expected 401 on unauth faculty POST');

  // 2. Role escalation rejected on public registration
  r = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'QA Escalate Attempt',
      email: 'qa.escalate@fcit.test',
      password: 'StudentPass!2026',
      role: 'super_admin',
    }),
  });
  assert.equal(r.status, 400, 'Disallowed role in public registration must be rejected');

  // Normal student registration
  r = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'QA Student',
      email: 'qa.student@fcit.test',
      password: 'StudentPass!2026',
    }),
  });
  assert.equal(r.status, 201);
  const studentCookie = r.headers.get('set-cookie').split(';')[0];
  const studentPayload = await r.json();
  assert.equal(studentPayload.data.user.role, 'student');

  // 3. Student forbidden from admin overview
  r = await fetch(`${base}/admin/overview`, { headers: { Cookie: studentCookie } });
  assert.equal(r.status, 403);

  // 4. Super admin login + Faculty CRUD + Magic-byte image check
  r = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPass }),
  });
  assert.equal(r.status, 200);
  const adminCookie = r.headers.get('set-cookie').split(';')[0];

  r = await fetch(`${base}/faculty`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({
      name: 'QA Test Faculty Record',
      designation: 'Professor',
      qualifications: ['Ph.D.', 'M.Tech'],
      photoPosition: 'object-center',
      isPublished: true,
    }),
  });
  assert.equal(r.status, 201);
  const createdFac = (await r.json()).data;
  assert.deepEqual(createdFac.qualifications, ['Ph.D.', 'M.Tech']);
  assert.equal(createdFac.photoPosition, 'object-center');

  // Forged PNG rejected
  const badForm = new FormData();
  badForm.append('image', new Blob(['NOT_A_REAL_PNG_FILE'], { type: 'image/png' }), 'forged.png');
  r = await fetch(`${base}/faculty/${createdFac._id}/photo`, {
    method: 'POST',
    headers: { Cookie: adminCookie },
    body: badForm,
  });
  assert.equal(r.status, 400);

  // Authentic PNG bytes accepted
  const realPng = Buffer.from(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
    'hex'
  );
  const goodForm = new FormData();
  goodForm.append('image', new Blob([realPng], { type: 'image/png' }), 'valid.png');
  r = await fetch(`${base}/faculty/${createdFac._id}/photo`, {
    method: 'POST',
    headers: { Cookie: adminCookie },
    body: goodForm,
  });
  assert.equal(r.status, 200);
  const updatedFac = (await r.json()).data;
  assert.ok(updatedFac.photo.startsWith('/uploads/faculty/'));

  // Remove photo + delete faculty record
  r = await fetch(`${base}/faculty/${createdFac._id}/photo`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  });
  assert.equal(r.status, 200);
  r = await fetch(`${base}/faculty/${createdFac._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  });
  assert.equal(r.status, 200);

  // 5. Event creation + student registration + contact submission
  r = await fetch(`${base}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({
      title: 'QA Verification Session',
      category: 'workshop',
      date: new Date(Date.now() + 86400000).toISOString(),
      venue: 'CSE Seminar Room',
      summary: 'Temporary verification event for automated integration checks.',
      description: 'Detailed temporary verification description exceeding minimum length.',
      status: 'upcoming',
      isPublished: true,
    }),
  });
  assert.equal(r.status, 201);
  const ev = (await r.json()).data;

  r = await fetch(`${base}/events/${ev._id}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: 'QA Participant',
      email: 'participant@hbtu.test',
      rollNumber: '240104001',
      branch: 'CSE',
      year: '2nd Year',
    }),
  });
  assert.equal(r.status, 201);

  r = await fetch(`${base}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'QA Contact',
      email: 'contact@hbtu.test',
      subject: 'QA Verification Inquiry',
      category: 'general',
      message: 'Automated verification message confirming contact persistence.',
    }),
  });
  assert.equal(r.status, 201);
  const contactId = (await r.json()).data.id;

  // Overview counts
  r = await fetch(`${base}/admin/overview`, { headers: { Cookie: adminCookie } });
  assert.equal(r.status, 200);
  const ov = await r.json();
  assert.ok(ov.data.counts.events >= 1);
  assert.ok(ov.data.counts.registrations >= 1);

  // Clean up faculty/event/contact checks complete — now verify History Archive schema, verification & additional-image endpoints
  r = await fetch(`${base}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({
      year: 2024,
      title: 'QA Milestone Verification Entry',
      shortTitle: 'QA Milestone',
      category: 'Institutional Milestone',
      layoutVariant: 'collage',
      description: 'Automated test entry confirming numeric year coercion and timeline CRUD.',
      highlights: ['Tested highlights persistence'],
      contributors: ['QA Verifier'],
      historicalSource: 'QA Test Ledger',
      isPublished: true,
    }),
  });
  assert.equal(r.status, 201);
  const createdHist = (await r.json()).data;
  assert.equal(createdHist.year, '2024');
  assert.equal(createdHist.verificationStatus, 'pending_verification');

  // Verify status toggle
  r = await fetch(`${base}/history/${createdHist._id}/verification`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ verificationStatus: 'verified' }),
  });
  assert.equal(r.status, 200);
  const verifiedHist = (await r.json()).data;
  assert.equal(verifiedHist.verificationStatus, 'verified');

  // Additional image upload & removal
  const extraForm = new FormData();
  extraForm.append('image', new Blob([realPng], { type: 'image/png' }), 'extra.png');
  r = await fetch(`${base}/history/${createdHist._id}/additional-images`, {
    method: 'POST',
    headers: { Cookie: adminCookie },
    body: extraForm,
  });
  assert.equal(r.status, 201);
  const withExtra = (await r.json()).data;
  assert.ok(withExtra.additionalImages.length === 1);
  const extraUrl = withExtra.additionalImages[0];

  r = await fetch(`${base}/history/${createdHist._id}/additional-images`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ url: extraUrl }),
  });
  assert.equal(r.status, 200);

  r = await fetch(`${base}/history/${createdHist._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  });
  assert.equal(r.status, 200);

  // Team Member privacy email sanitization check
  r = await fetch(`${base}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({
      name: 'QA Team Member',
      designation: 'Technical Head',
      academicYear: '2026 / 2027',
      email: 'private.student@hbtu.test',
      showEmailPublicly: false,
      photoPosition: 'object-center',
      isPublished: true,
    }),
  });
  assert.equal(r.status, 201);
  const createdTeam = (await r.json()).data;

  // Unauthenticated public GET /team must hide private email
  r = await fetch(`${base}/team`);
  assert.equal(r.status, 200);
  const publicTeam = (await r.json()).data;
  const matchedHidden = publicTeam.find((m) => m._id === createdTeam._id);
  assert.ok(matchedHidden, 'Published team member missing in public list');
  assert.equal(matchedHidden.email, '', 'Private team email must be stripped from public response');

  // Toggle showEmailPublicly -> true
  r = await fetch(`${base}/team/${createdTeam._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({
      name: 'QA Team Member',
      designation: 'Technical Head',
      academicYear: '2026 / 2027',
      email: 'private.student@hbtu.test',
      showEmailPublicly: true,
      isPublished: true,
    }),
  });
  assert.equal(r.status, 200);

  r = await fetch(`${base}/team`);
  assert.equal(r.status, 200);
  const publicTeamVisible = (await r.json()).data;
  const matchedVisible = publicTeamVisible.find((m) => m._id === createdTeam._id);
  assert.equal(matchedVisible.email, 'private.student@hbtu.test');

  r = await fetch(`${base}/team/${createdTeam._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  });
  assert.equal(r.status, 200);

  // Clean up test records
  await EventRegistration.deleteMany({ eventId: ev._id });
  await Event.findByIdAndDelete(ev._id);
  await ContactMessage.findByIdAndDelete(contactId);
  await User.deleteMany({ email: { $in: [adminEmail, 'qa.student@fcit.test'] } });

  console.log('ALL_BACKEND_SECURITY_AND_API_TESTS_PASSED');
} finally {
  srv.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}
