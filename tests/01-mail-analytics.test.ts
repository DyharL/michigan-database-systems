import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseMailLogs } from '../src/modules/01-mail-analytics.js';

describe('Module 01: Mail Log Analytics', () => {
  it('parses mbox text logs and aggregates sender frequencies and hourly distributions', () => {
    const sampleLog = `
From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008
Return-Path: <stephen.marquard@uct.ac.za>
Subject: [sakai] svn commit: r39772

From louis@media.berkeley.edu Fri Jan  4 18:10:48 2008
Return-Path: <louis@media.berkeley.edu>
Subject: [sakai] svn commit: r39771

From stephen.marquard@uct.ac.za Fri Jan  4 09:12:18 2008
Return-Path: <stephen.marquard@uct.ac.za>
Subject: [sakai] svn commit: r39770
    `;

    const summary = parseMailLogs(sampleLog);
    assert.equal(summary.totalMessages, 3);
    assert.equal(summary.senders['stephen.marquard@uct.ac.za'], 2);
    assert.equal(summary.senders['louis@media.berkeley.edu'], 1);
    assert.equal(summary.hourlyDistribution['09'], 2);
    assert.equal(summary.hourlyDistribution['18'], 1);
    assert.equal(summary.topSender.email, 'stephen.marquard@uct.ac.za');
    assert.equal(summary.topSender.count, 2);
  });
});
